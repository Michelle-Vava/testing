import { PrismaService } from '../../infrastructure/database/prisma.service';
export declare class ActivitiesService {
    private prisma;
    constructor(prisma: PrismaService);
    findByUserId(userId: string, limit?: number): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        type: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        userId: string;
    }[]>;
    create(userId: string, type: string, description: string, metadata?: any): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        type: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        userId: string;
    }>;
}
