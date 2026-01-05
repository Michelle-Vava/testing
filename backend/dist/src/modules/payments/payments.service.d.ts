import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../infrastructure/database/prisma.service';
export declare class PaymentsService {
    private configService;
    private prisma;
    private stripe;
    constructor(configService: ConfigService, prisma: PrismaService);
    createCharge(jobId: string, userId: string): Promise<{
        payment: {
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
        };
        clientSecret: string | null;
    }>;
    createPayout(jobId: string, userId: string): Promise<{
        message: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        payment: {
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
        };
    }>;
    listTransactions(userId: string, userRoles: string[]): Promise<({
        owner: {
            id: string;
            name: string;
            email: string;
        };
        provider: {
            id: string;
            name: string;
            email: string;
        };
        job: {
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
        };
    } & {
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
    })[]>;
}
