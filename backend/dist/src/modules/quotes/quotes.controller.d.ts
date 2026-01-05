import { QuotesService } from './quotes.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { AuthenticatedRequest } from '../../shared/types/express-request.interface';
export declare class QuotesController {
    private quotesService;
    constructor(quotesService: QuotesService);
    findByRequest(req: AuthenticatedRequest, requestId: string): Promise<({
        provider: {
            id: string;
            name: string;
            email: string;
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
    })[]>;
    create(req: AuthenticatedRequest, quoteData: CreateQuoteDto): Promise<{
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
    }>;
    accept(req: AuthenticatedRequest, id: string): Promise<{
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
        job: {
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
    }>;
    reject(req: AuthenticatedRequest, id: string): Promise<{
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
    }>;
}
