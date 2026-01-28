import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { EmailService } from '../../shared/services/email/email.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteStatusDto } from './dto/update-quote-status.dto';
import { QuoteStatus, RequestStatus, JobStatus } from '../../shared/enums';

import { QuoteEntity } from './entities/quote.entity';

@Injectable()
export class QuotesService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
    private emailService: EmailService,
  ) {}

  async findByRequest(requestId: string, userId: string, userRoles: string[]) {
    const request = await this.prisma.serviceRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException(`Service request with ID ${requestId} not found`);
    }

    const isOwner = request.ownerId === userId;
    const isProvider = userRoles.includes('provider');

    if (!isOwner && !isProvider) {
      throw new ForbiddenException('You do not have access to these quotes');
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
            providerProfile: { select: { businessName: true } }
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return quotes;
  }

  async create(userId: string, userRoles: string[], quoteData: CreateQuoteDto) {
    if (!userRoles.includes('provider')) {
      throw new ForbiddenException('Only providers can submit quotes');
    }

    const request = await this.prisma.serviceRequest.findUnique({
      where: { id: quoteData.requestId },
    });

    if (!request) {
      throw new NotFoundException(`Service request with ID ${quoteData.requestId} not found`);
    }

    if (request.status === 'completed' || request.status === 'in_progress') {
      throw new BadRequestException(`Service request ${quoteData.requestId} is no longer accepting quotes (status: ${request.status})`);
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
            providerProfile: { select: { businessName: true } }
          },
        },
      },
    });

    // Update request status to 'quoted' if it was 'open'
    if (request.status === RequestStatus.OPEN) {
      await this.prisma.serviceRequest.update({
        where: { id: quoteData.requestId },
        data: { status: RequestStatus.QUOTED },
      });
    }

    // Notify the request owner
    await this.notificationsService.create(
      request.ownerId,
      'quote_received',
      'New Quote Received',
      `You have received a new quote for your request: ${request.title}`,
      `/requests/${request.id}`
    );
     
    // Send email notification to owner
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

    return quote;
  }

  async accept(quoteId: string, userId: string) {
    const quote = await this.prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
        request: true,
      },
    });

    if (!quote) {
      throw new NotFoundException(`Quote with ID ${quoteId} not found`);
    }

    if (quote.request.ownerId !== userId) {
      throw new ForbiddenException(`Access denied: Only the owner of service request ${quote.requestId} can accept quotes`);
    }

    if (quote.status !== QuoteStatus.PENDING) {
      throw new BadRequestException(`Quote ${quoteId} cannot be accepted (current status: ${quote.status})`);
    }

    // Check if another quote has already been accepted (job locking)
    const existingJob = await this.prisma.job.findFirst({
      where: {
        requestId: quote.requestId,
      },
    });

    if (existingJob) {
      throw new BadRequestException(`This service request already has an accepted quote. Only one quote can be accepted per request.`);
    }

    // Start a transaction: accept quote, reject others, update request, create job
    const result = await this.prisma.$transaction(async (prisma) => {
      // Accept this quote
      const updatedQuote = await prisma.quote.update({
        where: { id: quoteId },
        data: { status: QuoteStatus.ACCEPTED },
      });
      
      // Reject other pending quotes for this request
      await prisma.quote.updateMany({
        where: {
          requestId: quote.requestId,
          id: { not: quoteId },
          status: QuoteStatus.PENDING,
        },
        data: { status: QuoteStatus.REJECTED },
      });

      // Update request status
      await prisma.serviceRequest.update({
        where: { id: quote.requestId },
        data: { status: RequestStatus.IN_PROGRESS },
      });
      
      // Create job from accepted quote
      const job = await prisma.job.create({
        data: {
          quoteId,
          requestId: quote.requestId,
          providerId: quote.providerId,
          ownerId: userId,
          status: JobStatus.PENDING,
        },
      });

      return { quote: updatedQuote, job };
    });

    // Notify the provider
    await this.notificationsService.create(
      quote.providerId,
      'quote_accepted',
      'Quote Accepted',
      `Your quote for ${quote.request.title} has been accepted!`,
      `/jobs/${result.job.id}`
    );

    // Send email notification to provider
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

  async reject(quoteId: string, userId: string) {
    const quote = await this.prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
        request: true,
      },
    });

    if (!quote) {
      throw new NotFoundException(`Quote with ID ${quoteId} not found`);
    }

    if (quote.request.ownerId !== userId) {
      throw new ForbiddenException(`Access denied: Only the owner of service request ${quote.requestId} can reject quotes`);
    }

    if (quote.status !== QuoteStatus.PENDING) {
      throw new BadRequestException(`Quote ${quoteId} cannot be rejected (current status: ${quote.status})`);
    }

    return this.prisma.quote.update({
      where: { id: quoteId },
      data: { status: QuoteStatus.REJECTED },
    });
  }
}
