import { NotificationsService } from './notifications.service';
import { AuthenticatedRequest } from '../../shared/types/express-request.interface';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findAll(req: AuthenticatedRequest): Promise<{
        link: string | null;
        message: string;
        id: string;
        userId: string;
        createdAt: Date;
        type: string;
        title: string;
        isRead: boolean;
    }[]>;
    getUnreadCount(req: AuthenticatedRequest): Promise<{
        unreadCount: number;
    }>;
    markAsRead(id: string, req: AuthenticatedRequest): Promise<{
        link: string | null;
        message: string;
        id: string;
        userId: string;
        createdAt: Date;
        type: string;
        title: string;
        isRead: boolean;
    }>;
    markAllAsRead(req: AuthenticatedRequest): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
