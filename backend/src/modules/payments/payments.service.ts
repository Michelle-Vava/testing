import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY')!,
      { apiVersion: '2025-12-15.clover' },
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
      throw new NotFoundException('Job not found');
    }

    if (job.ownerId !== userId) {
      throw new ForbiddenException('You can only pay for your own jobs');
    }

    if (job.status !== 'completed') {
      throw new BadRequestException('Job must be completed before payment');
    }

    if (job.payments && job.payments.length > 0) {
      throw new BadRequestException('Payment already exists for this job');
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

  async createPayout(jobId: string, userId: string) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      include: {
        quote: true,
        payments: true,
      },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.providerId !== userId) {
      throw new ForbiddenException('You can only request payout for your own jobs');
    }

    const payment = job.payments?.[0];
    if (!payment || payment.status !== 'paid') {
      throw new BadRequestException('Job must be paid before payout');
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
}
