import { Test, TestingModule } from '@nestjs/testing';
import { ProvidersService } from '../providers.service';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { ProviderStatus } from '@prisma/client';

describe('ProvidersService', () => {
  let service: ProvidersService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    providerProfile: {
      upsert: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProvidersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProvidersService>(ProvidersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findFeatured', () => {
    it('should return featured providers', async () => {
      const mockProviders = [
        {
          id: '1',
          name: 'Test User',
          roles: ['provider'],
          providerProfile: {
            businessName: 'Business 1',
            rating: 4.5,
            reviewCount: 10,
            serviceTypes: ['Type1', 'Type2'],
          },
          ownerProfile: {
            city: 'City',
            state: 'State',
          },
        },
      ];

      mockPrismaService.user.findMany.mockResolvedValue(mockProviders);

      const result = await service.findFeatured();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
      expect(result[0].name).toBe('Business 1');
      expect(prismaService.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 4,
          where: expect.objectContaining({
            roles: { has: 'provider' },
            providerProfile: expect.objectContaining({
              status: ProviderStatus.ACTIVE,
            }),
          }),
        }),
      );
    });
  });

  describe('findAll', () => {
    it('should return providers based on filters', async () => {
      const mockProviders = [
        {
          id: '1',
          name: 'Test User',
          providerProfile: {
            businessName: 'Business 1',
            status: ProviderStatus.ACTIVE,
            serviceTypes: ['TypeA'],
            yearsInBusiness: 5,
            rating: 5,
            reviewCount: 20,
            isMobileService: true,
            isShopService: false,
          },
          ownerProfile: {
            bio: 'Bio',
            city: 'City',
            state: 'State',
          },
        },
      ];

      mockPrismaService.user.findMany.mockResolvedValue(mockProviders);

      const filters = { serviceType: 'TypeA', limit: 10 };
      const result = await service.findAll(filters);

      expect(result).toHaveLength(1);
      expect(result[0].businessName).toBe('Business 1');
      expect(prismaService.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 10,
          where: expect.objectContaining({
            providerProfile: expect.objectContaining({
              serviceTypes: { has: 'TypeA' },
            }),
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a provider by id', async () => {
      const mockProvider = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        providerProfile: {
          businessName: 'Business 1',
          rating: 4.5,
        },
        ownerProfile: {
          bio: 'Bio',
        },
        _count: {
          providedQuotes: 5,
          providerJobs: 3,
        },
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockProvider);

      const result = await service.findOne('1');

      expect(result.id).toBe('1');
      expect(result.businessName).toBe('Business 1');
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: expect.any(Object),
      });
    });

    it('should throw NotFoundException if provider not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProfile', () => {
    it('should upsert provider profile', async () => {
      const userId = '1';
      const updateData = { businessName: 'New Name' };
      const mockResult = { id: 'p1', userId, ...updateData };

      mockPrismaService.providerProfile.upsert.mockResolvedValue(mockResult);

      const result = await service.updateProfile(userId, updateData);

      expect(result).toEqual(mockResult);
      expect(prismaService.providerProfile.upsert).toHaveBeenCalledWith({
        where: { userId },
        create: { userId, ...updateData },
        update: { ...updateData },
      });
    });
  });
});
