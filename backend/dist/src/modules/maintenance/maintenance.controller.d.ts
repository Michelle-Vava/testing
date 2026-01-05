import { MaintenanceService } from './maintenance.service';
import { CreateMaintenanceRecordDto } from './dto/create-maintenance-record.dto';
import { AuthenticatedRequest } from '../../shared/types/express-request.interface';
export declare class MaintenanceController {
    private maintenanceService;
    constructor(maintenanceService: MaintenanceService);
    findAll(req: AuthenticatedRequest, vehicleId: string): Promise<{
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
    create(req: AuthenticatedRequest, vehicleId: string, data: CreateMaintenanceRecordDto): Promise<{
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
    delete(req: AuthenticatedRequest, id: string): Promise<{
        message: string;
    }>;
}
