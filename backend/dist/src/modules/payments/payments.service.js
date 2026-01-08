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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../infrastructure/database/prisma.service");
const stripe_1 = __importDefault(require("stripe"));
let PaymentsService = PaymentsService_1 = class PaymentsService {
    configService;
    prisma;
    logger = new common_1.Logger(PaymentsService_1.name);
    stripe;
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
        this.stripe = new stripe_1.default(this.configService.get('STRIPE_SECRET_KEY'), { apiVersion: '2023-10-16' });
    }
    async createCharge(jobId, userId) {
        const job = await this.prisma.job.findUnique({
            where: { id: jobId },
            include: {
                quote: true,
                payments: true,
            },
        });
        if (!job) {
            throw new common_1.NotFoundException(`Job with ID ${jobId} not found`);
        }
        if (job.ownerId !== userId) {
            throw new common_1.ForbiddenException(`Access denied: You can only pay for your own jobs (Job ID: ${jobId})`);
        }
        if (job.status !== 'completed') {
            throw new common_1.BadRequestException(`Job ${jobId} must be completed before payment (current status: ${job.status})`);
        }
        if (job.payments && job.payments.length > 0) {
            throw new common_1.BadRequestException(`Payment already exists for job ${jobId}`);
        }
        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: Math.round(parseFloat(job.quote.amount.toString()) * 100),
            currency: 'usd',
            metadata: {
                jobId: job.id,
                ownerId: job.ownerId,
                providerId: job.providerId,
            },
        });
        const payment = await this.prisma.payment.create({
            data: {
                jobId,
                ownerId: job.ownerId,
                providerId: job.providerId,
                amount: job.quote.amount,
                stripePaymentIntentId: paymentIntent.id,
                status: 'pending',
            },
        });
        return {
            payment,
            clientSecret: paymentIntent.client_secret,
        };
    }
    async completePayment(paymentId) {
        const payment = await this.prisma.payment.findUnique({
            where: { id: paymentId },
        });
        if (!payment) {
            throw new common_1.NotFoundException(`Payment with ID ${paymentId} not found`);
        }
        if (payment.status === 'completed') {
            return payment;
        }
        const updatedPayment = await this.prisma.payment.update({
            where: { id: paymentId },
            data: { status: 'completed' },
        });
        return updatedPayment;
    }
    async createPayout(jobId, userId) {
        const job = await this.prisma.job.findUnique({
            where: { id: jobId },
            include: {
                quote: true,
                payments: true,
            },
        });
        if (!job) {
            throw new common_1.NotFoundException(`Job with ID ${jobId} not found`);
        }
        if (job.providerId !== userId) {
            throw new common_1.ForbiddenException(`Access denied: You can only request payout for your own jobs (Job ID: ${jobId})`);
        }
        const payment = job.payments?.[0];
        if (!payment || payment.status !== 'paid') {
            throw new common_1.BadRequestException(`Job ${jobId} must be paid before payout (current payment status: ${payment?.status || 'none'})`);
        }
        return {
            message: 'Payout initiated',
            amount: payment.amount,
            payment: payment,
        };
    }
    async listTransactions(userId, userRoles) {
        const isProvider = userRoles.includes('provider');
        return this.prisma.payment.findMany({
            where: isProvider
                ? { providerId: userId }
                : { ownerId: userId },
            include: {
                job: {
                    include: {
                        request: {
                            include: {
                                vehicle: true,
                            },
                        },
                        quote: true,
                    },
                },
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                provider: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async handleWebhook(rawBody, signature) {
        const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
        if (!webhookSecret) {
            throw new Error('Stripe webhook secret not configured');
        }
        let event;
        try {
            event = this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            throw new Error(`Webhook signature verification failed: ${message}`);
        }
        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object;
                await this.handlePaymentIntentSucceeded(paymentIntent);
                break;
            case 'payment_intent.payment_failed':
                const failedPayment = event.data.object;
                await this.handlePaymentIntentFailed(failedPayment);
                break;
            default:
                this.logger.warn(`Unhandled Stripe event type: ${event.type}`);
        }
        return { received: true };
    }
    async handlePaymentIntentSucceeded(paymentIntent) {
        const payment = await this.prisma.payment.findFirst({
            where: { stripePaymentIntentId: paymentIntent.id },
        });
        if (payment && payment.status !== 'completed') {
            await this.prisma.payment.update({
                where: { id: payment.id },
                data: { status: 'completed' },
            });
        }
    }
    async handlePaymentIntentFailed(paymentIntent) {
        const payment = await this.prisma.payment.findFirst({
            where: { stripePaymentIntentId: paymentIntent.id },
        });
        if (payment) {
            await this.prisma.payment.update({
                where: { id: payment.id },
                data: { status: 'failed' },
            });
        }
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map