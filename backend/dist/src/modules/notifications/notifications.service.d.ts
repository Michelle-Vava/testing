import { PrismaService } from '../../infrastructure/database/prisma.service';
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    findByUserId(userId: string): Promise<{
        id: string;
        createdAt: Date;
        link: string | null;
        type: string;
        userId: string;
        title: string;
        message: string;
        isRead: boolean;
    }[]>;
    getUnreadCount(userId: string): Promise<{
        unreadCount: number;
    }>;
    markAsRead(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        link: string | null;
        type: string;
        userId: string;
        title: string;
        message: string;
        isRead: boolean;
    }>;
    markAllAsRead(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
