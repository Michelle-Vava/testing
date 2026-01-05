import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { UpdateMileageDto } from './dto/update-mileage.dto';
import { PaginationDto } from '../../shared/dto/pagination.dto';
import { AuthenticatedRequest } from '../../shared/types/express-request.interface';
export declare class VehiclesController {
    private vehiclesService;
    constructor(vehiclesService: VehiclesService);
    findAll(req: AuthenticatedRequest, paginationDto: PaginationDto): Promise<{
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            make: string;
            model: string;
            year: number;
            vin: string | null;
            licensePlate: string | null;
            color: string | null;
            mileage: number | null;
            ownerId: string;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    create(req: AuthenticatedRequest, vehicleData: CreateVehicleDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        make: string;
        model: string;
        year: number;
        vin: string | null;
        licensePlate: string | null;
        color: string | null;
        mileage: number | null;
        ownerId: string;
    }>;
    findOne(req: AuthenticatedRequest, id: string): Promise<{
        owner: {
            id: string;
            name: string;
            email: string;
            phone: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        make: string;
        model: string;
        year: number;
        vin: string | null;
        licensePlate: string | null;
        color: string | null;
        mileage: number | null;
        ownerId: string;
    }>;
    update(req: AuthenticatedRequest, id: string, vehicleData: UpdateVehicleDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        make: string;
        model: string;
        year: number;
        vin: string | null;
        licensePlate: string | null;
        color: string | null;
        mileage: number | null;
        ownerId: string;
    }>;
    updateMileage(req: AuthenticatedRequest, id: string, mileageData: UpdateMileageDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        make: string;
        model: string;
        year: number;
        vin: string | null;
        licensePlate: string | null;
        color: string | null;
        mileage: number | null;
        ownerId: string;
    }>;
    delete(req: AuthenticatedRequest, id: string): Promise<{
        message: string;
    }>;
}
