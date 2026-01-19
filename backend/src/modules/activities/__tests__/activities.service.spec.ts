import { Test, TestingModule } from '@nestjs/testing';
import { ActivitiesService } from '../activities.service';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

describe('ActivitiesService', () => {
  let service: ActivitiesService;
  let prisma: PrismaService;

  const mockActivity = {
    id: 'activity-1',
    userId: 'user-1',
    type: 'VEHICLE_ADDED',
    description: 'Added a new vehicle',
    metadata: { vehicleId: 'vehicle-1' },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivitiesService,
        {
          provide: PrismaService,
          useValue: {
            activity: {
              findMany: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ActivitiesService>(ActivitiesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByUserId', () => {
    it('should return activities for a user with default limit', async () => {
      jest.spyOn(prisma.activity, 'findMany').mockResolvedValue([mockActivity]);

      const result = await service.findByUserId('user-1');

      expect(prisma.activity.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });
      expect(result).toEqual([mockActivity]);
    });

    it('should respect custom limit', async () => {
      jest.spyOn(prisma.activity, 'findMany').mockResolvedValue([mockActivity]);

      await service.findByUserId('user-1', 5);

      expect(prisma.activity.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        orderBy: { createdAt: 'desc' },
        take: 5,
      });
    });
  });

  describe('create', () => {
    it('should create an activity', async () => {
      jest.spyOn(prisma.activity, 'create').mockResolvedValue(mockActivity);

      const result = await service.create(
        'user-1',
        'VEHICLE_ADDED',
        'Added a new vehicle',
        { vehicleId: 'vehicle-1' }
      );

      expect(prisma.activity.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          type: 'VEHICLE_ADDED',
          description: 'Added a new vehicle',
          metadata: { vehicleId: 'vehicle-1' },
        },
      });
      expect(result).toEqual(mockActivity);
    });

    it('should create activity without metadata', async () => {
      const activityWithoutMeta = { ...mockActivity, metadata: null };
      jest.spyOn(prisma.activity, 'create').mockResolvedValue(activityWithoutMeta);

      await service.create('user-1', 'LOGIN', 'User logged in');

      expect(prisma.activity.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          type: 'LOGIN',
          description: 'User logged in',
          metadata: undefined,
        },
      });
    });
  });
});
