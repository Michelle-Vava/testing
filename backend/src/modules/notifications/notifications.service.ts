import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { NotificationsGateway } from './notifications.gateway';

/**
 * NotificationsService handles all notification management
 * 
 * Creates, retrieves, and manages notifications for users.
 * Integrates with WebSocket gateway for real-time delivery.
 */
@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  /**
   * Create a new notification and emit it via WebSocket
   * 
   * @param userId - Target user's UUID
   * @param type - Notification type (e.g., 'quote', 'job_update', 'message')
   * @param title - Short notification title
   * @param message - Notification body text
   * @param link - Optional link for navigation
   * @returns Created notification entity
   */
  async create(userId: string, type: string, title: string, message: string, link?: string) {
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        link,
      },
    });

    // Emit real-time notification
    this.notificationsGateway.sendNotificationToUser(userId, notification);

    return notification;
  }

  /**
   * Get all notifications for a user, ordered by most recent
   * 
   * @param userId - User's UUID
   * @returns Array of notifications
   */
  async findByUserId(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get count of unread notifications for a user
   * 
   * @param userId - User's UUID
   * @returns Object with unreadCount property
   */
  async getUnreadCount(userId: string) {
    const count = await this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
    return { unreadCount: count };
  }

  /**
   * Mark a single notification as read
   * 
   * @param id - Notification UUID
   * @param userId - User's UUID (for ownership validation)
   * @returns Updated notification
   */
  async markAsRead(id: string, userId: string) {
    return this.prisma.notification.update({
      where: { id, userId },
      data: { isRead: true },
    });
  }

  /**
   * Mark all notifications as read for a user
   * 
   * @param userId - User's UUID
   * @returns Prisma batch update result
   */
  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }
}