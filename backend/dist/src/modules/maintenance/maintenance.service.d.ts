import { PrismaService } from '../../infrastructure/database/prisma.service';
import { CreateMaintenanceRecordDto } from './dto/create-maintenance-record.dto';
export declare class MaintenanceService {
    private prisma;
    constructor(prisma: PrismaService);
    findAllForVehicle(vehicleId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        mileage: number | null;
        vehicleId: string;
        notes: string | null;
        serviceType: string;
        serviceDate: Date;
        cost: import("@prisma/client/runtime/library").Decimal | null;
        performedBy: string | null;
    }[]>;
    create(vehicleId: string, userId: string, data: CreateMaintenanceRecordDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        mileage: number | null;
        vehicleId: string;
        notes: string | null;
        serviceType: string;
        serviceDate: Date;
        cost: import("@prisma/client/runtime/library").Decimal | null;
        performedBy: string | null;
    }>;
    delete(id: string, userId: string): Promise<{
        message: string;
    }>;
}
