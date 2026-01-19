import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { RequestsQueryDto } from './dto/requests-query.dto';
import { AuthenticatedRequest } from '../../shared/types/express-request.interface';
import { UploadService } from '../../shared/services/upload.service';
export declare class RequestsController {
    private requestsService;
    private uploadService;
    private readonly logger;
    constructor(requestsService: RequestsService, uploadService: UploadService);
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
    findAll(req: AuthenticatedRequest, query: RequestsQueryDto): Promise<{
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
    create(req: AuthenticatedRequest, requestData: CreateRequestDto): Promise<{
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
    findOne(req: AuthenticatedRequest, id: string): Promise<{
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
            amount: import("@prisma/client/runtime/library").Decimal;
            laborCost: import("@prisma/client/runtime/library").Decimal | null;
            partsCost: import("@prisma/client/runtime/library").Decimal | null;
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
    update(req: AuthenticatedRequest, id: string, updateData: UpdateRequestDto): Promise<{
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
    uploadImages(req: AuthenticatedRequest, id: string, files: Express.Multer.File[]): Promise<{
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
    deleteImage(req: AuthenticatedRequest, id: string, imageUrl: string): Promise<{
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
