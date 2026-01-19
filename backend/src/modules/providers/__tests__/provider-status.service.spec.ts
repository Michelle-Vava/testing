import { Test, TestingModule } from '@nestjs/testing';
import { ProviderStatusService } from '../provider-status.service';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ProviderStatus } from '@prisma/client';

describe('ProviderStatusService', () => {
  let service: ProviderStatusService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProviderStatusService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProviderStatusService>(ProviderStatusService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateStatus', () => {
    it('should update status if validation passes', async () => {
      const userId = '1';
      const user = {
        id: userId,
        roles: ['provider'],
        phone: '123',
        providerProfile: {
          status: ProviderStatus.NONE,
          businessName: 'Biz',
          serviceTypes: ['Type'],
          shopCity: 'City',
          shopState: 'State',
          isMobileService: true,
          yearsInBusiness: 1,
        },
        ownerProfile: {
          bio: 'Bio',
        },
      };

      mockPrismaService.user.findUnique.mockResolvedValue(user);
      mockPrismaService.user.update.mockResolvedValue({
        id: userId,
        providerProfile: { status: ProviderStatus.DRAFT },
      });

      const result = await service.updateStatus(userId, ProviderStatus.DRAFT);

      expect(result).toEqual({ status: ProviderStatus.DRAFT });
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: expect.any(Object),
        include: { providerProfile: true },
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      await expect(service.updateStatus('1', ProviderStatus.ACTIVE)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if user is not provider', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: '1',
        roles: [],
      });
      await expect(service.updateStatus('1', ProviderStatus.ACTIVE)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getOnboardingStatus', () => {
    it('should return checklist and percentage', async () => {
      const userId = '1';
      const user = {
        id: userId,
        phone: '123',
        providerProfile: {
          status: ProviderStatus.NONE,
          businessName: 'Biz',
          serviceTypes: ['Type'],
          shopCity: 'City',
          shopState: 'State',
          isMobileService: true,
          yearsInBusiness: 1,
        },
        ownerProfile: {
          bio: 'Bio',
        },
      };

      mockPrismaService.user.findUnique.mockResolvedValue(user);

      const result = await service.getOnboardingStatus(userId);

      expect(result.completionPercent).toBe(100);
      expect(result.canSubmit).toBe(true);
      expect(result.checklist.basicInfo).toBe(true);
    });

    it('should return partial completion', async () => {
      const userId = '1';
      const user = {
        id: userId,
        phone: '123',
        providerProfile: {
          // Missing businessName
          serviceTypes: [],
        },
        ownerProfile: {},
      };

      mockPrismaService.user.findUnique.mockResolvedValue(user);

      const result = await service.getOnboardingStatus(userId);

      expect(result.canSubmit).toBe(false);
      expect(result.completionPercent).toBeLessThan(100);
    });
  });

  describe('completeOnboarding', () => {
     it('should complete onboarding if valid', async () => {
       const userId = '1';
      const user = {
        id: userId,
        roles: ['provider'],
        phone: '123',
        providerProfile: {
          status: ProviderStatus.DRAFT,
          businessName: 'Biz',
          serviceTypes: ['Type'],
          shopCity: 'City',
          shopState: 'State',
          isMobileService: true,
          yearsInBusiness: 1,
        },
        ownerProfile: {
          bio: 'Bio',
        },
      };

      mockPrismaService.user.findUnique.mockResolvedValue(user);
      mockPrismaService.user.update.mockResolvedValue({
          id: userId,
          providerProfile: { status: ProviderStatus.LIMITED }
      });

      const result = await service.completeOnboarding(userId);
      // It calls updateStatus internally, which calls prisma update
      // We mocked findUnique again inside updateStatus? 
      // Actually updateStatus calls findUnique too.
      // Since mocks are stateful in jest if we don't return different values on consecutive calls, it returns the same.
      
      expect(prismaService.user.update).toHaveBeenCalledWith(
          expect.objectContaining({
              data: expect.objectContaining({
                  providerProfile: expect.objectContaining({
                      update: expect.objectContaining({
                          status: ProviderStatus.LIMITED
                      })
                  })
              })
          })
      );
     });

     it('should throw BadRequest if profile incomplete', async () => {
        const userId = '1';
      const user = {
        id: userId,
        roles: ['provider'],
        phone: '123',
        providerProfile: {
          status: ProviderStatus.DRAFT,
          // incomplete
        },
        ownerProfile: {},
      };

      mockPrismaService.user.findUnique.mockResolvedValue(user);
      
      // I need to mock the validation helper if I could, but I can't.
      // So I rely on logic. Validation logic uses providerProfile fields.
      
      await expect(service.completeOnboarding(userId)).rejects.toThrow(BadRequestException);
     });
  });

});
