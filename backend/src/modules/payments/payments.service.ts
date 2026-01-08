import { Injectable, NotFoundException, ForbiddenException, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY')!,
      { apiVersion: '2023-10-16' as any },
    );
  }

  async createCharge(jobId: string, userId: string) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      include: {
        quote: true,
        payments: true,
      },
    });

    if (!job) {
      throw new NotFoundException(`Job with ID ${jobId} not found`);
    }

    if (job.ownerId !== userId) {
      throw new ForbiddenException(`Access denied: You can only pay for your own jobs (Job ID: ${jobId})`);
    }

    if (job.status !== 'completed') {
      throw new BadRequestException(`Job ${jobId} must be completed before payment (current status: ${job.status})`);
    }

    if (job.payments && job.payments.length > 0) {
      throw new BadRequestException(`Payment already exists for job ${jobId}`);
    }

    // Create Stripe PaymentIntent
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(parseFloat(job.quote.amount.toString()) * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        jobId: job.id,
        ownerId: job.ownerId,
        providerId: job.providerId,
      },
    });

    // Create payment record
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

  async completePayment(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${paymentId} not found`);
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

  async createPayout(jobId: string, userId: string) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      include: {
        quote: true,
        payments: true,
      },
    });

    if (!job) {
      throw new NotFoundException(`Job with ID ${jobId} not found`);
    }

    if (job.providerId !== userId) {
      throw new ForbiddenException(`Access denied: You can only request payout for your own jobs (Job ID: ${jobId})`);
    }

    const payment = job.payments?.[0];
    if (!payment || payment.status !== 'paid') {
      throw new BadRequestException(`Job ${jobId} must be paid before payout (current payment status: ${payment?.status || 'none'})`);
    }

    // In a real implementation, you would create a Stripe Transfer or Payout here
    // For now, we'll just return the payment info
    return {
      message: 'Payout initiated',
      amount: payment.amount,
      payment: payment,
    };
  }

  async listTransactions(userId: string, userRoles: string[]) {
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

  /**
   * Handle Stripe webhook events
   * 
   * Verifies webhook signature and processes events like payment_intent.succeeded
   */
  async handleWebhook(rawBody: Buffer, signature: string) {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    
    if (!webhookSecret) {
      throw new Error('Stripe webhook secret not configured');
    }

    let event;

    try {
      // Verify webhook signature
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      throw new Error(`Webhook signature verification failed: ${message}`);
    }

    // Handle the event
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

  private async handlePaymentIntentSucceeded(paymentIntent: any) {
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

  private async handlePaymentIntentFailed(paymentIntent: any) {
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
}
