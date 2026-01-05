import { NotificationsService } from './notifications.service';
import { AuthenticatedRequest } from '../../shared/types/express-request.interface';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findAll(req: AuthenticatedRequest): Promise<{
        id: string;
        createdAt: Date;
        link: string | null;
        type: string;
        userId: string;
        title: string;
        message: string;
        isRead: boolean;
    }[]>;
    getUnreadCount(req: AuthenticatedRequest): Promise<{
        unreadCount: number;
    }>;
    markAsRead(id: string, req: AuthenticatedRequest): Promise<{
        id: string;
        createdAt: Date;
        link: string | null;
        type: string;
        userId: string;
        title: string;
        message: string;
        isRead: boolean;
    }>;
    markAllAsRead(req: AuthenticatedRequest): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
