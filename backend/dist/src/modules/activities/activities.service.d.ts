import { PrismaService } from '../../infrastructure/database/prisma.service';
export declare class ActivitiesService {
    private prisma;
    constructor(prisma: PrismaService);
    findByUserId(userId: string, limit?: number): Promise<{
        id: string;
        userId: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        type: string;
        description: string;
    }[]>;
    create(userId: string, type: string, description: string, metadata?: any): Promise<{
        id: string;
        userId: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        type: string;
        description: string;
    }>;
}
