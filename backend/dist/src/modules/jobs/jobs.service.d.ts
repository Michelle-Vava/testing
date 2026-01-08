import { PrismaService } from '../../infrastructure/database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { EmailService } from '../../shared/services/email.service';
import { UpdateJobStatusDto } from './dto/update-job-status.dto';
import { PaginationDto } from '../../shared/dto/pagination.dto';
export declare class JobsService {
    private prisma;
    private notificationsService;
    private emailService;
    private readonly logger;
    constructor(prisma: PrismaService, notificationsService: NotificationsService, emailService: EmailService);
    findAll(userId: string, userRoles: string[], paginationDto: PaginationDto): Promise<{
        data: ({
            quote: {
                id: string;
                createdAt: Date;
                description: string | null;
                updatedAt: Date;
                status: string;
                requestId: string;
                providerId: string;
                amount: import("@prisma/client/runtime/library").Decimal;
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
                    year: number;
                    make: string;
                    model: string;
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
                description: string;
                title: string;
                deletedAt: Date | null;
                updatedAt: Date;
                status: string;
                ownerId: string;
                imageUrls: string[];
                vehicleId: string;
                urgency: string;
            };
            payments: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                status: string;
                ownerId: string;
                providerId: string;
                amount: import("@prisma/client/runtime/library").Decimal;
                jobId: string;
                stripePaymentIntentId: string | null;
                paidAt: Date | null;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            ownerId: string;
            requestId: string;
            providerId: string;
            startedAt: Date | null;
            completedAt: Date | null;
            quoteId: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string, userId: string): Promise<{
        quote: {
            id: string;
            createdAt: Date;
            description: string | null;
            updatedAt: Date;
            status: string;
            requestId: string;
            providerId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
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
                year: number;
                make: string;
                model: string;
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
            description: string;
            title: string;
            deletedAt: Date | null;
            updatedAt: Date;
            status: string;
            ownerId: string;
            imageUrls: string[];
            vehicleId: string;
            urgency: string;
        };
        payments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            ownerId: string;
            providerId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            jobId: string;
            stripePaymentIntentId: string | null;
            paidAt: Date | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        ownerId: string;
        requestId: string;
        providerId: string;
        startedAt: Date | null;
        completedAt: Date | null;
        quoteId: string;
    }>;
    updateStatus(id: string, userId: string, statusData: UpdateJobStatusDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        ownerId: string;
        requestId: string;
        providerId: string;
        startedAt: Date | null;
        completedAt: Date | null;
        quoteId: string;
    }>;
}
