import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { UpdateMileageDto } from './dto/update-mileage.dto';
import { PaginationDto } from '../../shared/dto/pagination.dto';
import { AuthenticatedRequest } from '../../shared/types/express-request.interface';
import { UploadService } from '../../shared/services/upload.service';
export declare class VehiclesController {
    private vehiclesService;
    private uploadService;
    constructor(vehiclesService: VehiclesService, uploadService: UploadService);
    findAll(req: AuthenticatedRequest, paginationDto: PaginationDto): Promise<import("../../shared/utils/pagination.helper").PaginatedResult<{
        id: string;
        createdAt: Date;
        deletedAt: Date | null;
        updatedAt: Date;
        make: string;
        model: string;
        year: number;
        vin: string | null;
        licensePlate: string | null;
        color: string | null;
        mileage: number | null;
        ownerId: string;
        imageUrls: string[];
    }>>;
    create(req: AuthenticatedRequest, vehicleData: CreateVehicleDto): Promise<{
        id: string;
        createdAt: Date;
        deletedAt: Date | null;
        updatedAt: Date;
        make: string;
        model: string;
        year: number;
        vin: string | null;
        licensePlate: string | null;
        color: string | null;
        mileage: number | null;
        ownerId: string;
        imageUrls: string[];
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
        deletedAt: Date | null;
        updatedAt: Date;
        make: string;
        model: string;
        year: number;
        vin: string | null;
        licensePlate: string | null;
        color: string | null;
        mileage: number | null;
        ownerId: string;
        imageUrls: string[];
    }>;
    update(req: AuthenticatedRequest, id: string, vehicleData: UpdateVehicleDto): Promise<{
        id: string;
        createdAt: Date;
        deletedAt: Date | null;
        updatedAt: Date;
        make: string;
        model: string;
        year: number;
        vin: string | null;
        licensePlate: string | null;
        color: string | null;
        mileage: number | null;
        ownerId: string;
        imageUrls: string[];
    }>;
    updateMileage(req: AuthenticatedRequest, id: string, mileageData: UpdateMileageDto): Promise<{
        id: string;
        createdAt: Date;
        deletedAt: Date | null;
        updatedAt: Date;
        make: string;
        model: string;
        year: number;
        vin: string | null;
        licensePlate: string | null;
        color: string | null;
        mileage: number | null;
        ownerId: string;
        imageUrls: string[];
    }>;
    delete(req: AuthenticatedRequest, id: string): Promise<{
        message: string;
    }>;
    uploadImages(req: AuthenticatedRequest, id: string, files: Express.Multer.File[]): Promise<{
        id: string;
        createdAt: Date;
        deletedAt: Date | null;
        updatedAt: Date;
        make: string;
        model: string;
        year: number;
        vin: string | null;
        licensePlate: string | null;
        color: string | null;
        mileage: number | null;
        ownerId: string;
        imageUrls: string[];
    }>;
    deleteImage(req: AuthenticatedRequest, id: string, imageUrl: string): Promise<{
        id: string;
        createdAt: Date;
        deletedAt: Date | null;
        updatedAt: Date;
        make: string;
        model: string;
        year: number;
        vin: string | null;
        licensePlate: string | null;
        color: string | null;
        mileage: number | null;
        ownerId: string;
        imageUrls: string[];
    }>;
}
