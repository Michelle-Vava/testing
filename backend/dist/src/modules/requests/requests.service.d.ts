import { PrismaService } from '../../infrastructure/database/prisma.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { PaginationDto } from '../../shared/dto/pagination.dto';
export declare class RequestsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    findPublicRecent(): Promise<({
        vehicle: {
            make: string;
            model: string;
            year: number;
        };
        _count: {
            quotes: number;
        };
    } & {
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
        vehicleId: string;
        title: string;
        urgency: string;
        status: string;
    })[]>;
    findAll(userId: string, userRoles: string[], paginationDto: PaginationDto): Promise<{
        data: ({
            owner: {
                name: string;
                phone: string | null;
            };
            vehicle: {
                make: string;
                model: string;
                year: number;
            };
            _count: {
                quotes: number;
            };
        } & {
            id: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            ownerId: string;
            vehicleId: string;
            title: string;
            urgency: string;
            status: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    } | {
        data: ({
            vehicle: {
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
            };
            _count: {
                quotes: number;
            };
        } & {
            id: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            ownerId: string;
            vehicleId: string;
            title: string;
            urgency: string;
            status: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    create(userId: string, requestData: CreateRequestDto): Promise<{
        vehicle: {
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
        };
    } & {
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
        vehicleId: string;
        title: string;
        urgency: string;
        status: string;
    }>;
    findOne(id: string, userId: string, userRoles: string[]): Promise<{
        owner: {
            id: string;
            name: string;
            email: string;
            phone: string | null;
        };
        vehicle: {
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
        };
        quotes: ({
            provider: {
                id: string;
                name: string;
                phone: string | null;
            };
        } & {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            requestId: string;
            providerId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            estimatedDuration: string;
            notes: string | null;
            includesWarranty: boolean;
        })[];
    } & {
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
        vehicleId: string;
        title: string;
        urgency: string;
        status: string;
    }>;
    update(id: string, userId: string, updateData: UpdateRequestDto): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
        vehicleId: string;
        title: string;
        urgency: string;
        status: string;
    }>;
}
