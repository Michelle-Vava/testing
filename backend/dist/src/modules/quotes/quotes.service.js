"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuotesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/database/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const email_service_1 = require("../../shared/services/email.service");
const enums_1 = require("../../shared/enums");
const quote_entity_1 = require("./entities/quote.entity");
let QuotesService = class QuotesService {
    prisma;
    notificationsService;
    emailService;
    constructor(prisma, notificationsService, emailService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
        this.emailService = emailService;
    }
    async findByRequest(requestId, userId, userRoles) {
        const request = await this.prisma.serviceRequest.findUnique({
            where: { id: requestId },
        });
        if (!request) {
            throw new common_1.NotFoundException(`Service request with ID ${requestId} not found`);
        }
        const isOwner = request.ownerId === userId;
        const isProvider = userRoles.includes('provider');
        if (!isOwner && !isProvider) {
            throw new common_1.ForbiddenException('You do not have access to these quotes');
        }
        const quotes = await this.prisma.quote.findMany({
            where: { requestId },
            include: {
                provider: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return quotes.map(quote => new quote_entity_1.QuoteEntity(quote));
    }
    async create(userId, userRoles, quoteData) {
        if (!userRoles.includes('provider')) {
            throw new common_1.ForbiddenException('Only providers can submit quotes');
        }
        const request = await this.prisma.serviceRequest.findUnique({
            where: { id: quoteData.requestId },
        });
        if (!request) {
            throw new common_1.NotFoundException(`Service request with ID ${quoteData.requestId} not found`);
        }
        if (request.status === 'completed' || request.status === 'in_progress') {
            throw new common_1.BadRequestException(`Service request ${quoteData.requestId} is no longer accepting quotes (status: ${request.status})`);
        }
        const quote = await this.prisma.quote.create({
            data: {
                ...quoteData,
                providerId: userId,
                status: 'pending',
            },
            include: {
                provider: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                    },
                },
            },
        });
        if (request.status === enums_1.RequestStatus.OPEN) {
            await this.prisma.serviceRequest.update({
                where: { id: quoteData.requestId },
                data: { status: enums_1.RequestStatus.QUOTED },
            });
        }
        await this.notificationsService.create(request.ownerId, 'quote_received', 'New Quote Received', `You have received a new quote for your request: ${request.title}`, `/requests/${request.id}`);
        const owner = await this.prisma.user.findUnique({
            where: { id: request.ownerId },
            select: { email: true, name: true },
        });
        if (owner) {
            await this.emailService.sendQuoteReceivedEmail({
                ownerEmail: owner.email,
                ownerName: owner.name,
                providerName: quote.provider.name,
                requestTitle: request.title,
                amount: quote.amount.toString(),
                estimatedDuration: quote.estimatedDuration,
                requestId: request.id,
            });
        }
        return new quote_entity_1.QuoteEntity(quote);
    }
    async accept(quoteId, userId) {
        const quote = await this.prisma.quote.findUnique({
            where: { id: quoteId },
            include: {
                request: true,
            },
        });
        if (!quote) {
            throw new common_1.NotFoundException(`Quote with ID ${quoteId} not found`);
        }
        if (quote.request.ownerId !== userId) {
            throw new common_1.ForbiddenException(`Access denied: Only the owner of service request ${quote.requestId} can accept quotes`);
        }
        if (quote.status !== enums_1.QuoteStatus.PENDING) {
            throw new common_1.BadRequestException(`Quote ${quoteId} cannot be accepted (current status: ${quote.status})`);
        }
        const result = await this.prisma.$transaction(async (prisma) => {
            const updatedQuote = await prisma.quote.update({
                where: { id: quoteId },
                data: { status: enums_1.QuoteStatus.ACCEPTED },
            });
            await prisma.quote.updateMany({
                where: {
                    requestId: quote.requestId,
                    id: { not: quoteId },
                    status: enums_1.QuoteStatus.PENDING,
                },
                data: { status: enums_1.QuoteStatus.REJECTED },
            });
            await prisma.serviceRequest.update({
                where: { id: quote.requestId },
                data: { status: enums_1.RequestStatus.IN_PROGRESS },
            });
            const job = await prisma.job.create({
                data: {
                    quoteId,
                    requestId: quote.requestId,
                    providerId: quote.providerId,
                    ownerId: userId,
                    status: enums_1.JobStatus.PENDING,
                },
            });
            return { quote: updatedQuote, job };
        });
        await this.notificationsService.create(quote.providerId, 'quote_accepted', 'Quote Accepted', `Your quote for ${quote.request.title} has been accepted!`, `/jobs/${result.job.id}`);
        const provider = await this.prisma.user.findUnique({
            where: { id: quote.providerId },
            select: { email: true, name: true },
        });
        const owner = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { name: true },
        });
        if (provider && owner) {
            await this.emailService.sendQuoteAcceptedEmail({
                providerEmail: provider.email,
                providerName: provider.name,
                ownerName: owner.name,
                requestTitle: quote.request.title,
                amount: quote.amount.toString(),
                jobId: result.job.id,
            });
        }
        return result;
    }
    async reject(quoteId, userId) {
        const quote = await this.prisma.quote.findUnique({
            where: { id: quoteId },
            include: {
                request: true,
            },
        });
        if (!quote) {
            throw new common_1.NotFoundException(`Quote with ID ${quoteId} not found`);
        }
        if (quote.request.ownerId !== userId) {
            throw new common_1.ForbiddenException(`Access denied: Only the owner of service request ${quote.requestId} can reject quotes`);
        }
        if (quote.status !== enums_1.QuoteStatus.PENDING) {
            throw new common_1.BadRequestException(`Quote ${quoteId} cannot be rejected (current status: ${quote.status})`);
        }
        return this.prisma.quote.update({
            where: { id: quoteId },
            data: { status: enums_1.QuoteStatus.REJECTED },
        });
    }
};
exports.QuotesService = QuotesService;
exports.QuotesService = QuotesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService,
        email_service_1.EmailService])
], QuotesService);
//# sourceMappingURL=quotes.service.js.map