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
exports.VehiclesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/database/prisma.service");
let VehiclesService = class VehiclesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(ownerId, paginationDto) {
        const { skip, take } = paginationDto;
        const [vehicles, total] = await Promise.all([
            this.prisma.vehicle.findMany({
                where: { ownerId },
                orderBy: { createdAt: 'desc' },
                skip,
                take,
            }),
            this.prisma.vehicle.count({ where: { ownerId } }),
        ]);
        return {
            data: vehicles,
            meta: {
                total,
                page: paginationDto.page,
                limit: paginationDto.limit,
                totalPages: Math.ceil(total / paginationDto.limit),
            },
        };
    }
    async create(ownerId, vehicleData) {
        return this.prisma.vehicle.create({
            data: {
                ...vehicleData,
                ownerId,
            },
        });
    }
    async findOne(id, userId) {
        const vehicle = await this.prisma.vehicle.findUnique({
            where: { id },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
            },
        });
        if (!vehicle) {
            throw new common_1.NotFoundException('Vehicle not found');
        }
        if (vehicle.ownerId !== userId) {
            throw new common_1.ForbiddenException('You can only access your own vehicles');
        }
        return vehicle;
    }
    async update(id, userId, vehicleData) {
        const vehicle = await this.prisma.vehicle.findUnique({
            where: { id },
        });
        if (!vehicle) {
            throw new common_1.NotFoundException('Vehicle not found');
        }
        if (vehicle.ownerId !== userId) {
            throw new common_1.ForbiddenException('You can only update your own vehicles');
        }
        return this.prisma.vehicle.update({
            where: { id },
            data: vehicleData,
        });
    }
    async delete(id, userId) {
        const vehicle = await this.prisma.vehicle.findUnique({
            where: { id },
        });
        if (!vehicle) {
            throw new common_1.NotFoundException('Vehicle not found');
        }
        if (vehicle.ownerId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own vehicles');
        }
        await this.prisma.vehicle.delete({
            where: { id },
        });
        return { message: 'Vehicle deleted successfully' };
    }
    async updateMileage(id, userId, mileage) {
        const vehicle = await this.prisma.vehicle.findUnique({
            where: { id },
        });
        if (!vehicle) {
            throw new common_1.NotFoundException('Vehicle not found');
        }
        if (vehicle.ownerId !== userId) {
            throw new common_1.ForbiddenException('You can only update your own vehicles');
        }
        return this.prisma.vehicle.update({
            where: { id },
            data: { mileage },
        });
    }
};
exports.VehiclesService = VehiclesService;
exports.VehiclesService = VehiclesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VehiclesService);
//# sourceMappingURL=vehicles.service.js.map