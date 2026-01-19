import { PrismaService } from '../../infrastructure/database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { EmailService } from '../../shared/services/email/email.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { QuoteEntity } from './entities/quote.entity';
export declare class QuotesService {
    private prisma;
    private notificationsService;
    private emailService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService, emailService: EmailService);
    findByRequest(requestId: string, userId: string, userRoles: string[]): Promise<QuoteEntity[]>;
    create(userId: string, userRoles: string[], quoteData: CreateQuoteDto): Promise<QuoteEntity>;
    accept(quoteId: string, userId: string): Promise<{
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
    reject(quoteId: string, userId: string): Promise<{
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
