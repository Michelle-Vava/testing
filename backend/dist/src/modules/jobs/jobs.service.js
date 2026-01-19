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
var JobsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/database/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const email_service_1 = require("../../shared/services/email/email.service");
const enums_1 = require("../../shared/enums");
const pagination_helper_1 = require("../../shared/utils/pagination.helper");
let JobsService = JobsService_1 = class JobsService {
    prisma;
    notificationsService;
    emailService;
    logger = new common_1.Logger(JobsService_1.name);
    constructor(prisma, notificationsService, emailService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
        this.emailService = emailService;
    }
    async findAll(userId, userRoles, paginationDto) {
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
        return (0, pagination_helper_1.paginate)(jobs, total, paginationDto);
    }
    async findOne(id, userId) {
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
            throw new common_1.NotFoundException(`Job with ID ${id} not found`);
        }
        if (job.ownerId !== userId && job.providerId !== userId) {
            throw new common_1.ForbiddenException(`Access denied: Job ${id} belongs to another user`);
        }
        return job;
    }
    async updateStatus(id, userId, statusData) {
        this.logger.debug(`Updating job ${id} status to ${statusData.status} by user ${userId}`);
        const job = await this.prisma.job.findUnique({
            where: { id },
        });
        if (!job) {
            throw new common_1.NotFoundException(`Job with ID ${id} not found`);
        }
        const isProvider = job.providerId === userId;
        const isOwner = job.ownerId === userId;
        if (!isProvider && !isOwner) {
            throw new common_1.ForbiddenException(`Update denied: You are not associated with job ${id}`);
        }
        if (isOwner && !isProvider) {
            if (job.status !== enums_1.JobStatus.PENDING_CONFIRMATION || statusData.status !== enums_1.JobStatus.COMPLETED) {
                throw new common_1.ForbiddenException(`Owners can only confirm completion of jobs marked as pending confirmation`);
            }
        }
        if (isProvider && !isOwner && job.status === enums_1.JobStatus.COMPLETED && statusData.status !== enums_1.JobStatus.COMPLETED) {
            throw new common_1.BadRequestException(`Job ${id} is already completed and cannot be modified`);
        }
        if (job.status === enums_1.JobStatus.COMPLETED && statusData.status !== enums_1.JobStatus.COMPLETED) {
            throw new common_1.BadRequestException(`Job ${id} is already completed and cannot be modified`);
        }
        const updateData = { status: statusData.status };
        if (statusData.status === enums_1.JobStatus.IN_PROGRESS && !job.startedAt) {
            updateData.startedAt = new Date();
        }
        else if (statusData.status === enums_1.JobStatus.COMPLETED && !job.completedAt) {
            updateData.completedAt = new Date();
        }
        const updatedJob = await this.prisma.$transaction(async (prisma) => {
            const updated = await prisma.job.update({
                where: { id },
                data: updateData,
            });
            if (statusData.status === enums_1.JobStatus.COMPLETED) {
                await prisma.serviceRequest.update({
                    where: { id: job.requestId },
                    data: { status: enums_1.RequestStatus.COMPLETED },
                });
            }
            return updated;
        });
        if (statusData.status === enums_1.JobStatus.COMPLETED) {
            await this.notificationsService.create(job.ownerId, 'job_completed', 'Job Completed', `Your job has been marked as completed. Please review and pay.`, `/jobs/${job.id}`);
        }
        const jobDetails = await this.prisma.job.findUnique({
            where: { id },
            include: {
                request: { select: { title: true } },
                owner: { select: { email: true, name: true } },
                provider: { select: { email: true, name: true } },
            },
        });
        if (jobDetails) {
            await this.emailService.sendJobStatusUpdateEmail({
                recipientEmail: jobDetails.owner.email,
                recipientName: jobDetails.owner.name,
                jobTitle: jobDetails.request.title,
                oldStatus: job.status,
                newStatus: statusData.status,
                jobId: id,
                isOwner: true,
            });
            if (statusData.status === enums_1.JobStatus.COMPLETED) {
                try {
                    await this.emailService.sendReviewReminderEmail({
                        ownerEmail: jobDetails.owner.email,
                        ownerName: jobDetails.owner.name,
                        providerName: jobDetails.provider.name,
                        jobTitle: jobDetails.request.title,
                        jobId: id,
                    });
                    this.logger.log(`Sent review reminder email for job ${id}`);
                }
                catch (error) {
                    this.logger.error(`Failed to send review reminder for job ${id}`, error instanceof Error ? error.stack : String(error));
                }
            }
        }
        return updatedJob;
    }
};
exports.JobsService = JobsService;
exports.JobsService = JobsService = JobsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService,
        email_service_1.EmailService])
], JobsService);
//# sourceMappingURL=jobs.service.js.map