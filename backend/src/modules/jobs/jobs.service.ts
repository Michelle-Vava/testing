import { Injectable, NotFoundException, ForbiddenException, BadRequestException, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { EmailService } from '../../shared/services/email/email.service';
import { UpdateJobStatusDto } from './dto/update-job-status.dto';
import { PaginationDto } from '../../shared/dto/pagination.dto';
import { JobStatus, RequestStatus } from '../../shared/enums';
import { paginate } from '../../shared/utils/pagination.helper';

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
    private emailService: EmailService,
  ) {}

  async findAll(userId: string, userRoles: string[], paginationDto: PaginationDto) {
    this.logger.debug(`Finding all jobs for user ${userId} with roles ${userRoles}`);
    const isProvider = userRoles.includes('provider');
    const { skip, take } = paginationDto;

    const where = isProvider
      ? { providerId: userId }
      : { ownerId: userId };

    const [jobs, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        include: {
          request: {
            include: {
              vehicle: true,
            },
          },
          quote: true,
          provider: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
            },
          },
          owner: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.job.count({ where }),
    ]);

    return paginate(jobs, total, paginationDto);
  }

  async findOne(id: string, userId: string) {
    this.logger.debug(`Finding job ${id} for user ${userId}`);
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: {
        request: {
          include: {
            vehicle: true,
          },
        },
        quote: true,
        provider: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
        owner: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
      },
    });

    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }

    if (job.ownerId !== userId && job.providerId !== userId) {
      throw new ForbiddenException(`Access denied: Job ${id} belongs to another user`);
    }

    return job;
  }

  async updateStatus(id: string, userId: string, statusData: UpdateJobStatusDto) {
    this.logger.debug(`Updating job ${id} status to ${statusData.status} by user ${userId}`);
    const job = await this.prisma.job.findUnique({
      where: { id },
    });

    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }

    // Phase 1: Allow both provider and owner to update status
    // Provider can update any status (pending -> in_progress -> pending_confirmation)
    // Owner can only update pending_confirmation -> completed
    const isProvider = job.providerId === userId;
    const isOwner = job.ownerId === userId;

    if (!isProvider && !isOwner) {
      throw new ForbiddenException(`Update denied: You are not associated with job ${id}`);
    }

    // Owner can only confirm completion (pending_confirmation -> completed)
    if (isOwner && !isProvider) {
      if (job.status !== JobStatus.PENDING_CONFIRMATION || statusData.status !== JobStatus.COMPLETED) {
        throw new ForbiddenException(`Owners can only confirm completion of jobs marked as pending confirmation`);
      }
    }

    // Provider cannot update a job that's already completed or confirmed by owner
    if (isProvider && !isOwner && job.status === JobStatus.COMPLETED && statusData.status !== JobStatus.COMPLETED) {
      throw new BadRequestException(`Job ${id} is already completed and cannot be modified`);
    }

    // Don't allow status changes on completed jobs (for both roles)
    if (job.status === JobStatus.COMPLETED && statusData.status !== JobStatus.COMPLETED) {
      throw new BadRequestException(`Job ${id} is already completed and cannot be modified`);
    }

    const updateData: Prisma.JobUpdateInput = { status: statusData.status };

    // Set timestamps based on status
    if (statusData.status === JobStatus.IN_PROGRESS && !job.startedAt) {
      updateData.startedAt = new Date();
    } else if (statusData.status === JobStatus.COMPLETED && !job.completedAt) {
      updateData.completedAt = new Date();
    }

    // Use transaction to update job and request together
    const updatedJob = await this.prisma.$transaction(async (prisma) => {
      const updated = await prisma.job.update({
        where: { id },
        data: updateData,
      });

      // Update service request status if job is completed
      if (statusData.status === JobStatus.COMPLETED) {
        await prisma.serviceRequest.update({
          where: { id: job.requestId },
          data: { status: RequestStatus.COMPLETED },
        });
      }

      return updated;
    });

    // Notify owner if job is completed
    if (statusData.status === JobStatus.COMPLETED) {
      await this.notificationsService.create(
        job.ownerId,
        'job_completed',
        'Job Completed',
        `Your job has been marked as completed. Please review and pay.`,
        `/jobs/${job.id}`
      );
    }

    // Send email notification for status change
    const jobDetails = await this.prisma.job.findUnique({
      where: { id },
      include: {
        request: { select: { title: true } },
        owner: { select: { email: true, name: true } },
        provider: { select: { email: true, name: true } },
      },
    });

    if (jobDetails) {
      // Notify owner about status change
      await this.emailService.sendJobStatusUpdateEmail({
        recipientEmail: jobDetails.owner.email,
        recipientName: jobDetails.owner.name,
        jobTitle: jobDetails.request.title,
        oldStatus: job.status,
        newStatus: statusData.status,
        jobId: id,
        isOwner: true,
      });

      // If completed, send review reminder email immediately
      // TODO: In production, use a cron job or task scheduler to send after 24 hours
      if (statusData.status === JobStatus.COMPLETED) {
        try {
          await this.emailService.sendReviewReminderEmail({
            ownerEmail: jobDetails.owner.email,
            ownerName: jobDetails.owner.name,
            providerName: jobDetails.provider.name,
            jobTitle: jobDetails.request.title,
            jobId: id,
          });
          this.logger.log(`Sent review reminder email for job ${id}`);
        } catch (error) {
          this.logger.error(
            `Failed to send review reminder for job ${id}`,
            error instanceof Error ? error.stack : String(error)
          );
          // Don't fail the job update if email fails
        }
      }
    }

    return updatedJob;
  }
}
