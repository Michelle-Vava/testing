import { PrismaService } from '../../infrastructure/database/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { PaginationDto } from '../../shared/dto/pagination.dto';
export declare class VehiclesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(ownerId: string, paginationDto: PaginationDto): Promise<import("../../shared/utils/pagination.helper").PaginatedResult<{
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
    create(ownerId: string, vehicleData: CreateVehicleDto): Promise<{
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
    findOne(id: string, userId: string): Promise<{
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
    update(id: string, userId: string, vehicleData: UpdateVehicleDto): Promise<{
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
    delete(id: string, userId: string): Promise<{
        message: string;
    }>;
    updateMileage(id: string, userId: string, mileage: number): Promise<{
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
    addImages(id: string, imageUrls: string[]): Promise<{
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
    removeImage(id: string, imageUrl: string): Promise<{
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
