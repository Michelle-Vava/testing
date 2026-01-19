import { Test, TestingModule } from '@nestjs/testing';
import { ProvidersController } from '../providers.controller';
import { ProvidersService } from '../providers.service';
import { ProviderStatusService } from '../provider-status.service';

describe('ProvidersController', () => {
  let controller: ProvidersController;
  let providersService: ProvidersService;
  let providerStatusService: ProviderStatusService;

  const mockProvidersService = {
    findFeatured: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    updateProfile: jest.fn(),
  };

  const mockProviderStatusService = {
    getOnboardingStatus: jest.fn(),
    completeOnboarding: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProvidersController],
      providers: [
        {
          provide: ProvidersService,
          useValue: mockProvidersService,
        },
        {
          provide: ProviderStatusService,
          useValue: mockProviderStatusService,
        },
      ],
    }).compile();

    controller = module.get<ProvidersController>(ProvidersController);
    providersService = module.get<ProvidersService>(ProvidersService);
    providerStatusService = module.get<ProviderStatusService>(ProviderStatusService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findFeatured', () => {
    it('should call providersService.findFeatured', async () => {
      const result = [{ id: '1' }];
      mockProvidersService.findFeatured.mockResolvedValue(result);

      expect(await controller.findFeatured()).toBe(result);
      expect(providersService.findFeatured).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should parse query params and call providersService.findAll', async () => {
      const result = [{ id: '1' }];
      mockProvidersService.findAll.mockResolvedValue(result);

      const query = {
        serviceType: 'repair',
        mobileService: 'true',
        shopService: 'false',
        minRating: '4.5',
        limit: '10',
      };

      expect(
        await controller.findAll(
          query.serviceType,
          query.mobileService,
          query.shopService,
          query.minRating,
          query.limit,
        ),
      ).toBe(result);

      expect(providersService.findAll).toHaveBeenCalledWith({
        serviceType: 'repair',
        mobileService: true,
        shopService: false,
        minRating: 4.5,
        limit: 10,
      });
    });
  });

  describe('findOne', () => {
    it('should call providersService.findOne', async () => {
      const result = { id: '1' };
      mockProvidersService.findOne.mockResolvedValue(result);

      expect(await controller.findOne('1')).toBe(result);
      expect(providersService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('updateProfile', () => {
    it('should call providersService.updateProfile with user id', async () => {
      const result = { id: '1' };
      const req = { user: { id: 'user1' } };
      const dto = { businessName: 'Biz' };
      mockProvidersService.updateProfile.mockResolvedValue(result);

      expect(await controller.updateProfile(req as any, dto)).toBe(result);
      expect(providersService.updateProfile).toHaveBeenCalledWith('user1', dto);
    });
  });

  describe('getOnboardingStatus', () => {
    it('should call providerStatusService.getOnboardingStatus', async () => {
      const result = { status: 'PENDING' };
      const req = { user: { id: 'user1' } };
      mockProviderStatusService.getOnboardingStatus.mockResolvedValue(result);

      expect(await controller.getOnboardingStatus(req as any)).toBe(result);
      expect(providerStatusService.getOnboardingStatus).toHaveBeenCalledWith('user1');
    });
  });

  describe('completeOnboarding', () => {
    it('should call providerStatusService.completeOnboarding', async () => {
      const result = { success: true };
      const req = { user: { id: 'user1' } };
      mockProviderStatusService.completeOnboarding.mockResolvedValue(result);

      expect(await controller.completeOnboarding(req as any)).toBe(result);
      expect(providerStatusService.completeOnboarding).toHaveBeenCalledWith('user1');
    });
  });
});
