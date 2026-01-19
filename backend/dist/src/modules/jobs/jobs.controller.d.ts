import { JobsService } from './jobs.service';
import { UpdateJobStatusDto } from './dto/update-job-status.dto';
import { PaginationDto } from '../../shared/dto/pagination.dto';
import { AuthenticatedRequest } from '../../shared/types/express-request.interface';
export declare class JobsController {
    private jobsService;
    private readonly logger;
    constructor(jobsService: JobsService);
    findAll(req: AuthenticatedRequest, paginationDto: PaginationDto): Promise<import("../../shared/utils/pagination.helper").PaginatedResult<{
        quote: {
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
        };
        owner: {
            id: string;
            name: string;
            email: string;
            phone: string | null;
        };
        provider: {
            id: string;
            name: string;
            email: string;
            phone: string | null;
        };
        request: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.JobStatus;
        ownerId: string;
        requestId: string;
        providerId: string;
        quoteId: string;
        startedAt: Date | null;
        completedAt: Date | null;
    }>>;
    findOne(req: AuthenticatedRequest, id: string): Promise<{
        quote: {
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
        };
        owner: {
            id: string;
            name: string;
            email: string;
            phone: string | null;
        };
        provider: {
            id: string;
            name: string;
            email: string;
            phone: string | null;
        };
        request: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.JobStatus;
        ownerId: string;
        requestId: string;
        providerId: string;
        quoteId: string;
        startedAt: Date | null;
        completedAt: Date | null;
    }>;
    updateStatus(req: AuthenticatedRequest, id: string, statusData: UpdateJobStatusDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.JobStatus;
        ownerId: string;
        requestId: string;
        providerId: string;
        quoteId: string;
        startedAt: Date | null;
        completedAt: Date | null;
    }>;
}
