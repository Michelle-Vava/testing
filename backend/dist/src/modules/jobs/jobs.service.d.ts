import { PrismaService } from '../../infrastructure/database/prisma.service';
import { UpdateJobStatusDto } from './dto/update-job-status.dto';
import { PaginationDto } from '../../shared/dto/pagination.dto';
export declare class JobsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    findAll(userId: string, userRoles: string[], paginationDto: PaginationDto): Promise<{
        data: ({
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
            quote: {
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
            };
            request: {
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
            };
            payments: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                ownerId: string;
                status: string;
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
            ownerId: string;
            status: string;
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
        quote: {
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
        };
        request: {
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
        };
        payments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            ownerId: string;
            status: string;
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
        ownerId: string;
        status: string;
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
        ownerId: string;
        status: string;
        requestId: string;
        providerId: string;
        startedAt: Date | null;
        completedAt: Date | null;
        quoteId: string;
    }>;
}
