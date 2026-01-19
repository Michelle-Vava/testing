import { Prisma } from '@prisma/client';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { RequestsQueryDto } from './dto/requests-query.dto';
export declare class RequestsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    findPublicRecent(): Promise<{
        quoteCount: number;
        quotes: undefined;
        vehicle: {
            make: string;
            model: string;
            year: number;
        };
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.RequestStatus;
        description: string;
        title: string;
        urgency: string;
    }[]>;
    findAll(userId: string, userRoles: string[], query: RequestsQueryDto): Promise<{
        data: ({
            vehicle: {
                make: string;
                model: string;
                year: number;
            };
            owner: {
                name: string;
                phone: string | null;
            };
            _count: {
                quotes: number;
            };
        } & {
            id: string;
            createdAt: Date;
            deletedAt: Date | null;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.RequestStatus;
            description: string;
            title: string;
            ownerId: string;
            imageUrls: string[];
            vehicleId: string;
            urgency: string;
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
            };
            _count: {
                quotes: number;
            };
        } & {
            id: string;
            createdAt: Date;
            deletedAt: Date | null;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.RequestStatus;
            description: string;
            title: string;
            ownerId: string;
            imageUrls: string[];
            vehicleId: string;
            urgency: string;
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
        };
    } & {
        id: string;
        createdAt: Date;
        deletedAt: Date | null;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.RequestStatus;
        description: string;
        title: string;
        ownerId: string;
        imageUrls: string[];
        vehicleId: string;
        urgency: string;
    }>;
    findOne(id: string, userId: string, userRoles: string[]): Promise<{
        vehicle: {
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
        };
        owner: {
            id: string;
            name: string;
            email: string;
            phone: string | null;
        };
        quotes: ({
            provider: {
                id: string;
                name: string;
                phone: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.QuoteStatus;
            description: string | null;
            requestId: string;
            providerId: string;
            amount: Prisma.Decimal;
            laborCost: Prisma.Decimal | null;
            partsCost: Prisma.Decimal | null;
            estimatedDuration: string;
            notes: string | null;
            includesWarranty: boolean;
        })[];
    } & {
        id: string;
        createdAt: Date;
        deletedAt: Date | null;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.RequestStatus;
        description: string;
        title: string;
        ownerId: string;
        imageUrls: string[];
        vehicleId: string;
        urgency: string;
    }>;
    update(id: string, userId: string, updateData: UpdateRequestDto): Promise<{
        id: string;
        createdAt: Date;
        deletedAt: Date | null;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.RequestStatus;
        description: string;
        title: string;
        ownerId: string;
        imageUrls: string[];
        vehicleId: string;
        urgency: string;
    }>;
    addImages(id: string, imageUrls: string[]): Promise<{
        id: string;
        createdAt: Date;
        deletedAt: Date | null;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.RequestStatus;
        description: string;
        title: string;
        ownerId: string;
        imageUrls: string[];
        vehicleId: string;
        urgency: string;
    }>;
    removeImage(id: string, imageUrl: string): Promise<{
        id: string;
        createdAt: Date;
        deletedAt: Date | null;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.RequestStatus;
        description: string;
        title: string;
        ownerId: string;
        imageUrls: string[];
        vehicleId: string;
        urgency: string;
    }>;
}
