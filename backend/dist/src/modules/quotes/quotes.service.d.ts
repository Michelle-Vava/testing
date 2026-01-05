import { PrismaService } from '../../infrastructure/database/prisma.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
export declare class QuotesService {
    private prisma;
    constructor(prisma: PrismaService);
    findByRequest(requestId: string, userId: string, userRoles: string[]): Promise<({
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
    create(userId: string, userRoles: string[], quoteData: CreateQuoteDto): Promise<{
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
    accept(quoteId: string, userId: string): Promise<{
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
    reject(quoteId: string, userId: string): Promise<{
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
