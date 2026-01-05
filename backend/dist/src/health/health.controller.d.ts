import { PrismaService } from '../infrastructure/database/prisma.service';
export declare class HealthController {
    private readonly db;
    constructor(db: PrismaService);
    check(): Promise<{
        status: string;
        timestamp: string;
        database: string;
        version: string;
        error?: undefined;
    } | {
        status: string;
        timestamp: string;
        database: string;
        error: string;
        version: string;
    }>;
}
