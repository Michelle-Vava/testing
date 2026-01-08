import { PaymentsService } from './payments.service';
import { AuthenticatedRequest } from '../../shared/types/express-request.interface';
export declare class PaymentsController {
    private paymentsService;
    constructor(paymentsService: PaymentsService);
    listTransactions(req: AuthenticatedRequest): Promise<({
        job: {
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
        };
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
    } & {
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
    })[]>;
    createCharge(req: AuthenticatedRequest, jobId: string): Promise<{
        payment: {
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
        };
        clientSecret: string | null;
    }>;
    completePayment(paymentId: string): Promise<{
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
    }>;
    createPayout(req: AuthenticatedRequest, jobId: string): Promise<{
        message: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        payment: {
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
        };
    }>;
}
