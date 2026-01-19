import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from '../notifications.service';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { NotificationsGateway } from '../notifications.gateway';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let prisma: PrismaService;
  let gateway: NotificationsGateway;

  const mockNotification = {
    id: 'notification-1',
    userId: 'user-1',
    type: 'QUOTE_RECEIVED',
    title: 'New Quote',
    message: 'You received a new quote for your request',
    link: '/requests/req-1',
    isRead: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: PrismaService,
          useValue: {
            notification: {
              create: jest.fn(),
              findMany: jest.fn(),
              count: jest.fn(),
              update: jest.fn(),
              updateMany: jest.fn(),
            },
          },
        },
        {
          provide: NotificationsGateway,
          useValue: {
            sendNotificationToUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    prisma = module.get<PrismaService>(PrismaService);
    gateway = module.get<NotificationsGateway>(NotificationsGateway);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a notification and emit it via gateway', async () => {
      jest.spyOn(prisma.notification, 'create').mockResolvedValue(mockNotification);
      
      const result = await service.create(
        'user-1',
        'QUOTE_RECEIVED',
        'New Quote',
        'You received a new quote for your request',
        '/requests/req-1'
      );

      expect(prisma.notification.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          type: 'QUOTE_RECEIVED',
          title: 'New Quote',
          message: 'You received a new quote for your request',
          link: '/requests/req-1',
        },
      });
      expect(gateway.sendNotificationToUser).toHaveBeenCalledWith('user-1', mockNotification);
      expect(result).toEqual(mockNotification);
    });
  });

  describe('findByUserId', () => {
    it('should return notifications for a user', async () => {
      jest.spyOn(prisma.notification, 'findMany').mockResolvedValue([mockNotification]);

      const result = await service.findByUserId('user-1');

      expect(prisma.notification.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual([mockNotification]);
    });
  });

  describe('getUnreadCount', () => {
    it('should return unread notification count', async () => {
      jest.spyOn(prisma.notification, 'count').mockResolvedValue(5);

      const result = await service.getUnreadCount('user-1');

      expect(prisma.notification.count).toHaveBeenCalledWith({
        where: { userId: 'user-1', isRead: false },
      });
      expect(result).toEqual({ unreadCount: 5 });
    });
  });

  describe('markAsRead', () => {
    it('should mark a notification as read', async () => {
      const readNotification = { ...mockNotification, isRead: true };
      jest.spyOn(prisma.notification, 'update').mockResolvedValue(readNotification);

      const result = await service.markAsRead('notification-1', 'user-1');

      expect(prisma.notification.update).toHaveBeenCalledWith({
        where: { id: 'notification-1', userId: 'user-1' },
        data: { isRead: true },
      });
      expect(result.isRead).toBe(true);
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read for a user', async () => {
      jest.spyOn(prisma.notification, 'updateMany').mockResolvedValue({ count: 3 });

      await service.markAllAsRead('user-1');

      expect(prisma.notification.updateMany).toHaveBeenCalledWith({
        where: { userId: 'user-1', isRead: false },
        data: { isRead: true },
      });
    });
  });
});
