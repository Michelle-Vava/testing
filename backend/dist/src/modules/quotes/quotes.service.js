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
const enums_1 = require("../../shared/enums");
let QuotesService = class QuotesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByRequest(requestId, userId, userRoles) {
        const request = await this.prisma.serviceRequest.findUnique({
            where: { id: requestId },
        });
        if (!request) {
            throw new common_1.NotFoundException('Service request not found');
        }
        const isOwner = request.ownerId === userId;
        const isProvider = userRoles.includes('provider');
        if (!isOwner && !isProvider) {
            throw new common_1.ForbiddenException('You do not have access to these quotes');
        }
        return this.prisma.quote.findMany({
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
    }
    async create(userId, userRoles, quoteData) {
        if (!userRoles.includes('provider')) {
            throw new common_1.ForbiddenException('Only providers can submit quotes');
        }
        const request = await this.prisma.serviceRequest.findUnique({
            where: { id: quoteData.requestId },
        });
        if (!request) {
            throw new common_1.NotFoundException('Service request not found');
        }
        if (request.status === 'completed' || request.status === 'in_progress') {
            throw new common_1.BadRequestException('This request is no longer accepting quotes');
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
        return quote;
    }
    async accept(quoteId, userId) {
        const quote = await this.prisma.quote.findUnique({
            where: { id: quoteId },
            include: {
                request: true,
            },
        });
        if (!quote) {
            throw new common_1.NotFoundException('Quote not found');
        }
        if (quote.request.ownerId !== userId) {
            throw new common_1.ForbiddenException('Only the request owner can accept quotes');
        }
        if (quote.status !== enums_1.QuoteStatus.PENDING) {
            throw new common_1.BadRequestException('This quote cannot be accepted');
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
            throw new common_1.NotFoundException('Quote not found');
        }
        if (quote.request.ownerId !== userId) {
            throw new common_1.ForbiddenException('Only the request owner can reject quotes');
        }
        if (quote.status !== enums_1.QuoteStatus.PENDING) {
            throw new common_1.BadRequestException('This quote cannot be rejected');
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
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QuotesService);
//# sourceMappingURL=quotes.service.js.map