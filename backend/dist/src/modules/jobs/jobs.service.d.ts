import { Prisma } from '@prisma/client';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { EmailService } from '../../shared/services/email/email.service';
import { UpdateJobStatusDto } from './dto/update-job-status.dto';
import { PaginationDto } from '../../shared/dto/pagination.dto';
export declare class JobsService {
    private prisma;
    private notificationsService;
    private emailService;
    private readonly logger;
    constructor(prisma: PrismaService, notificationsService: NotificationsService, emailService: EmailService);
    findAll(userId: string, userRoles: string[], paginationDto: PaginationDto): Promise<import("../../shared/utils/pagination.helper").PaginatedResult<{
        quote: {
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
    findOne(id: string, userId: string): Promise<{
        quote: {
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
    updateStatus(id: string, userId: string, statusData: UpdateJobStatusDto): Promise<{
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
