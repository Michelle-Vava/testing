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
exports.MaintenanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/database/prisma.service");
let MaintenanceService = class MaintenanceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAllForVehicle(vehicleId, userId) {
        const vehicle = await this.prisma.vehicle.findUnique({
            where: { id: vehicleId },
        });
        if (!vehicle) {
            throw new common_1.NotFoundException('Vehicle not found');
        }
        if (vehicle.ownerId !== userId) {
            throw new common_1.ForbiddenException('You can only view maintenance records for your own vehicles');
        }
        return this.prisma.maintenanceRecord.findMany({
            where: { vehicleId },
            orderBy: { serviceDate: 'desc' },
        });
    }
    async create(vehicleId, userId, data) {
        const vehicle = await this.prisma.vehicle.findUnique({
            where: { id: vehicleId },
        });
        if (!vehicle) {
            throw new common_1.NotFoundException('Vehicle not found');
        }
        if (vehicle.ownerId !== userId) {
            throw new common_1.ForbiddenException('You can only add maintenance records to your own vehicles');
        }
        return this.prisma.maintenanceRecord.create({
            data: {
                vehicleId,
                serviceType: data.serviceType,
                serviceDate: new Date(data.serviceDate),
                mileage: data.mileage,
                cost: data.cost,
                notes: data.notes,
                performedBy: data.performedBy,
            },
        });
    }
    async delete(id, userId) {
        const record = await this.prisma.maintenanceRecord.findUnique({
            where: { id },
            include: { vehicle: true },
        });
        if (!record) {
            throw new common_1.NotFoundException('Maintenance record not found');
        }
        if (record.vehicle.ownerId !== userId) {
            throw new common_1.ForbiddenException('You can only delete maintenance records from your own vehicles');
        }
        await this.prisma.maintenanceRecord.delete({
            where: { id },
        });
        return { message: 'Maintenance record deleted successfully' };
    }
};
exports.MaintenanceService = MaintenanceService;
exports.MaintenanceService = MaintenanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MaintenanceService);
//# sourceMappingURL=maintenance.service.js.map