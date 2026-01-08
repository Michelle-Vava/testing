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
const requests_query_dto_1 = require("./dto/requests-query.dto");
const enums_1 = require("../../shared/enums");
let RequestsService = RequestsService_1 = class RequestsService {
    prisma;
    logger = new common_1.Logger(RequestsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findPublicRecent() {
        this.logger.debug('Finding recent public requests');
        const requests = await this.prisma.serviceRequest.findMany({
            where: {
                status: { in: [enums_1.RequestStatus.OPEN, enums_1.RequestStatus.QUOTED] },
            },
            take: 4,
            select: {
                id: true,
                title: true,
                description: true,
                urgency: true,
                status: true,
                createdAt: true,
                vehicle: {
                    select: {
                        make: true,
                        model: true,
                        year: true,
                    },
                },
                quotes: {
                    select: { id: true },
                    take: 1,
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return requests.map(req => ({
            ...req,
            quoteCount: req.quotes?.length || 0,
            quotes: undefined,
        }));
    }
    async findAll(userId, userRoles, query) {
        this.logger.debug(`Finding all requests for user ${userId}`);
        const isProvider = userRoles && userRoles.includes('provider');
        const { page, limit, status, sort } = query;
        const skip = (page - 1) * limit;
        const take = limit;
        const orderBy = {};
        if (sort === requests_query_dto_1.RequestSort.OLDEST) {
            orderBy.createdAt = 'asc';
        }
        else {
            orderBy.createdAt = 'desc';
        }
        if (isProvider) {
            const where = {
                status: {
                    in: [enums_1.RequestStatus.OPEN, enums_1.RequestStatus.QUOTED],
                },
            };
            if (status) {
                where.status = status;
            }
            const [requests, total] = await Promise.all([
                this.prisma.serviceRequest.findMany({
                    where,
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
                    orderBy,
                    skip,
                    take,
                }),
                this.prisma.serviceRequest.count({
                    where,
                }),
            ]);
            return {
                data: requests,
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            };
        }
        else {
            const where = {
                ownerId: userId,
            };
            if (status) {
                where.status = status;
            }
            const [requests, total] = await Promise.all([
                this.prisma.serviceRequest.findMany({
                    where,
                    include: {
                        vehicle: true,
                        _count: {
                            select: {
                                quotes: true,
                            },
                        },
                    },
                    orderBy,
                    skip,
                    take,
                }),
                this.prisma.serviceRequest.count({ where }),
            ]);
            return {
                data: requests,
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
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
            throw new common_1.NotFoundException(`Vehicle with ID ${requestData.vehicleId} not found`);
        }
        if (vehicle.ownerId !== userId) {
            throw new common_1.ForbiddenException(`Access denied: You can only create service requests for vehicles you own (Vehicle ID: ${requestData.vehicleId})`);
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
            throw new common_1.NotFoundException(`Service request with ID ${id} not found`);
        }
        const isOwner = request.ownerId === userId;
        const isProvider = userRoles.includes('provider');
        if (!isOwner && !isProvider) {
            throw new common_1.ForbiddenException(`Access denied: You do not have access to service request ${id}`);
        }
        return request;
    }
    async update(id, userId, updateData) {
        const request = await this.prisma.serviceRequest.findUnique({
            where: { id },
        });
        if (!request) {
            throw new common_1.NotFoundException(`Service request with ID ${id} not found`);
        }
        if (request.ownerId !== userId) {
            throw new common_1.ForbiddenException(`Access denied: Service request ${id} belongs to another user`);
        }
        return this.prisma.serviceRequest.update({
            where: { id },
            data: updateData,
        });
    }
    async addImages(id, imageUrls) {
        const request = await this.prisma.serviceRequest.findUnique({
            where: { id },
        });
        if (!request) {
            throw new common_1.NotFoundException(`Service request with ID ${id} not found`);
        }
        return this.prisma.serviceRequest.update({
            where: { id },
            data: {
                imageUrls: {
                    push: imageUrls,
                },
            },
        });
    }
    async removeImage(id, imageUrl) {
        const request = await this.prisma.serviceRequest.findUnique({
            where: { id },
        });
        if (!request) {
            throw new common_1.NotFoundException(`Service request with ID ${id} not found`);
        }
        const updatedImageUrls = request.imageUrls.filter(url => url !== imageUrl);
        return this.prisma.serviceRequest.update({
            where: { id },
            data: {
                imageUrls: updatedImageUrls,
            },
        });
    }
};
exports.RequestsService = RequestsService;
exports.RequestsService = RequestsService = RequestsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RequestsService);
//# sourceMappingURL=requests.service.js.map