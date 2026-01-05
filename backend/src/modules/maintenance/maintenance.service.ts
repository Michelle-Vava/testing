import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { CreateMaintenanceRecordDto } from './dto/create-maintenance-record.dto';

@Injectable()
export class MaintenanceService {
  constructor(private prisma: PrismaService) {}

  async findAllForVehicle(vehicleId: string, userId: string) {
    // Verify user owns the vehicle
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    if (vehicle.ownerId !== userId) {
      throw new ForbiddenException('You can only view maintenance records for your own vehicles');
    }

    return this.prisma.maintenanceRecord.findMany({
      where: { vehicleId },
      orderBy: { serviceDate: 'desc' },
    });
  }

  async create(vehicleId: string, userId: string, data: CreateMaintenanceRecordDto) {
    // Verify user owns the vehicle
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    if (vehicle.ownerId !== userId) {
      throw new ForbiddenException('You can only add maintenance records to your own vehicles');
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

  async delete(id: string, userId: string) {
    const record = await this.prisma.maintenanceRecord.findUnique({
      where: { id },
      include: { vehicle: true },
    });

    if (!record) {
      throw new NotFoundException('Maintenance record not found');
    }

    if (record.vehicle.ownerId !== userId) {
      throw new ForbiddenException('You can only delete maintenance records from your own vehicles');
    }

    await this.prisma.maintenanceRecord.delete({
      where: { id },
    });

    return { message: 'Maintenance record deleted successfully' };
  }
}
