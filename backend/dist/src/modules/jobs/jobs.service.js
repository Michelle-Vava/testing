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
const enums_1 = require("../../shared/enums");
let JobsService = JobsService_1 = class JobsService {
    prisma;
    logger = new common_1.Logger(JobsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
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
                    payments: true,
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take,
            }),
            this.prisma.job.count({ where }),
        ]);
        return {
            data: jobs,
            meta: {
                total,
                page: paginationDto.page,
                limit: paginationDto.limit,
                totalPages: Math.ceil(total / paginationDto.limit),
            },
        };
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
                payments: true,
            },
        });
        if (!job) {
            throw new common_1.NotFoundException('Job not found');
        }
        if (job.ownerId !== userId && job.providerId !== userId) {
            throw new common_1.ForbiddenException('You do not have access to this job');
        }
        return job;
    }
    async updateStatus(id, userId, statusData) {
        this.logger.debug(`Updating job ${id} status to ${statusData.status} by user ${userId}`);
        const job = await this.prisma.job.findUnique({
            where: { id },
        });
        if (!job) {
            throw new common_1.NotFoundException('Job not found');
        }
        if (job.providerId !== userId) {
            throw new common_1.ForbiddenException('Only the provider can update job status');
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
        return updatedJob;
    }
};
exports.JobsService = JobsService;
exports.JobsService = JobsService = JobsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], JobsService);
//# sourceMappingURL=jobs.service.js.map