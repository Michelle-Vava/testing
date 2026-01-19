import { QuotesService } from './quotes.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { AuthenticatedRequest } from '../../shared/types/express-request.interface';
export declare class QuotesController {
    private quotesService;
    constructor(quotesService: QuotesService);
    findByRequest(req: AuthenticatedRequest, requestId: string): Promise<import("./entities/quote.entity").QuoteEntity[]>;
    create(req: AuthenticatedRequest, quoteData: CreateQuoteDto): Promise<import("./entities/quote.entity").QuoteEntity>;
    accept(req: AuthenticatedRequest, id: string): Promise<{
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
        job: {
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
        };
    }>;
    reject(req: AuthenticatedRequest, id: string): Promise<{
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
    }>;
}
