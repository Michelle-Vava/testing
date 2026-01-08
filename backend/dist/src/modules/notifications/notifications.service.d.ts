import { PrismaService } from '../../infrastructure/database/prisma.service';
import { NotificationsGateway } from './notifications.gateway';
export declare class NotificationsService {
    private prisma;
    private notificationsGateway;
    constructor(prisma: PrismaService, notificationsGateway: NotificationsGateway);
    create(userId: string, type: string, title: string, message: string, link?: string): Promise<{
        link: string | null;
        message: string;
        id: string;
        userId: string;
        createdAt: Date;
        type: string;
        title: string;
        isRead: boolean;
    }>;
    findByUserId(userId: string): Promise<{
        link: string | null;
        message: string;
        id: string;
        userId: string;
        createdAt: Date;
        type: string;
        title: string;
        isRead: boolean;
    }[]>;
    getUnreadCount(userId: string): Promise<{
        unreadCount: number;
    }>;
    markAsRead(id: string, userId: string): Promise<{
        link: string | null;
        message: string;
        id: string;
        userId: string;
        createdAt: Date;
        type: string;
        title: string;
        isRead: boolean;
    }>;
    markAllAsRead(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
