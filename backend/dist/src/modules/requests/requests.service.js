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
var RequestsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/database/prisma.service");
const enums_1 = require("../../shared/enums");
let RequestsService = RequestsService_1 = class RequestsService {
    prisma;
    logger = new common_1.Logger(RequestsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findPublicRecent() {
        this.logger.debug('Finding recent public requests');
        return this.prisma.serviceRequest.findMany({
            where: {
                status: {
                    in: [enums_1.RequestStatus.OPEN, enums_1.RequestStatus.QUOTED],
                },
            },
            take: 4,
            include: {
                vehicle: {
                    select: {
                        make: true,
                        model: true,
                        year: true,
                    },
                },
                _count: {
                    select: {
                        quotes: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findAll(userId, userRoles, paginationDto) {
        this.logger.debug(`Finding all requests for user ${userId}`);
        const isProvider = userRoles && userRoles.includes('provider');
        const { skip, take } = paginationDto;
        if (isProvider) {
            const [requests, total] = await Promise.all([
                this.prisma.serviceRequest.findMany({
                    where: {
                        status: {
                            in: [enums_1.RequestStatus.OPEN, enums_1.RequestStatus.QUOTED],
                        },
                    },
                    include: {
                        vehicle: {
                            select: {
                                make: true,
                                model: true,
                                year: true,
                            },
                        },
                        owner: {
                            select: {
                                name: true,
                                phone: true,
                            },
                        },
                        _count: {
                            select: {
                                quotes: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                    skip,
                    take,
                }),
                this.prisma.serviceRequest.count({
                    where: {
                        status: {
                            in: [enums_1.RequestStatus.OPEN, enums_1.RequestStatus.QUOTED],
                        },
                    },
                }),
            ]);
            return {
                data: requests,
                meta: {
                    total,
                    page: paginationDto.page,
                    limit: paginationDto.limit,
                    totalPages: Math.ceil(total / paginationDto.limit),
                },
            };
        }
        else {
            const [requests, total] = await Promise.all([
                this.prisma.serviceRequest.findMany({
                    where: { ownerId: userId },
                    include: {
                        vehicle: true,
                        _count: {
                            select: {
                                quotes: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                    skip,
                    take,
                }),
                this.prisma.serviceRequest.count({ where: { ownerId: userId } }),
            ]);
            return {
                data: requests,
                meta: {
                    total,
                    page: paginationDto.page,
                    limit: paginationDto.limit,
                    totalPages: Math.ceil(total / paginationDto.limit),
                },
            };
        }
    }
    async create(userId, requestData) {
        this.logger.debug(`Creating request for user ${userId}`);
        const vehicle = await this.prisma.vehicle.findUnique({
            where: { id: requestData.vehicleId },
        });
        if (!vehicle) {
            throw new common_1.NotFoundException('Vehicle not found');
        }
        if (vehicle.ownerId !== userId) {
            throw new common_1.ForbiddenException('You can only create requests for your own vehicles');
        }
        return this.prisma.serviceRequest.create({
            data: {
                ...requestData,
                ownerId: userId,
                status: enums_1.RequestStatus.OPEN,
            },
            include: {
                vehicle: true,
            },
        });
    }
    async findOne(id, userId, userRoles) {
        this.logger.debug(`Finding request ${id} for user ${userId}`);
        const request = await this.prisma.serviceRequest.findUnique({
            where: { id },
            include: {
                vehicle: true,
                owner: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        email: true,
                    },
                },
                quotes: {
                    include: {
                        provider: {
                            select: {
                                id: true,
                                name: true,
                                phone: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!request) {
            throw new common_1.NotFoundException('Service request not found');
        }
        const isOwner = request.ownerId === userId;
        const isProvider = userRoles.includes('provider');
        if (!isOwner && !isProvider) {
            throw new common_1.ForbiddenException('You do not have access to this request');
        }
        return request;
    }
    async update(id, userId, updateData) {
        const request = await this.prisma.serviceRequest.findUnique({
            where: { id },
        });
        if (!request) {
            throw new common_1.NotFoundException('Service request not found');
        }
        if (request.ownerId !== userId) {
            throw new common_1.ForbiddenException('You can only update your own requests');
        }
        return this.prisma.serviceRequest.update({
            where: { id },
            data: updateData,
        });
    }
};
exports.RequestsService = RequestsService;
exports.RequestsService = RequestsService = RequestsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RequestsService);
//# sourceMappingURL=requests.service.js.map