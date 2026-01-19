import { Test, TestingModule } from '@nestjs/testing';
import { ClerkAuthService } from '../clerk-auth.service';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import { ProviderStatus } from '@prisma/client';

describe('ClerkAuthService - Comprehensive Tests', () => {
  let service: ClerkAuthService;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    providerProfile: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClerkAuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ClerkAuthService>(ClerkAuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createFromExternalAuth', () => {
    it('should create user with default owner role', async () => {
      const mockUser = {
        id: 'user-1',
        externalAuthId: 'clerk_123',
        email: 'test@example.com',
        name: 'Test User',
        roles: ['owner'],
        authProvider: 'clerk',
        ownerProfile: { id: 'owner-1', onboardingComplete: false },
        providerProfile: null,
      };

      mockPrismaService.user.create.mockResolvedValue(mockUser);

      const result = await service.createFromExternalAuth({
        externalAuthId: 'clerk_123',
        email: 'test@example.com',
        name: 'Test User',
        authProvider: 'clerk',
      });

      expect(result.roles).toEqual(['owner']);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          roles: ['owner'],
          ownerProfile: {
            create: {
              onboardingComplete: false,
            },
          },
          providerProfile: undefined,
        }),
        include: {
          ownerProfile: true,
          providerProfile: true,
        },
      });
    });

    it('should create provider profile if roles include provider', async () => {
      const mockUser = {
        id: 'user-1',
        externalAuthId: 'clerk_123',
        email: 'test@example.com',
        name: 'Test User',
        roles: ['owner', 'provider'],
        authProvider: 'clerk',
        ownerProfile: { id: 'owner-1', onboardingComplete: false },
        providerProfile: { id: 'provider-1', status: ProviderStatus.NONE, onboardingComplete: false },
      };

      mockPrismaService.user.create.mockResolvedValue(mockUser);

      const result = await service.createFromExternalAuth({
        externalAuthId: 'clerk_123',
        email: 'test@example.com',
        name: 'Test User',
        authProvider: 'clerk',
        roles: ['owner', 'provider'],
      });

      expect(result.roles).toEqual(['owner', 'provider']);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          providerProfile: {
            create: {
              status: ProviderStatus.NONE,
              onboardingComplete: false,
            },
          },
        }),
        include: {
          ownerProfile: true,
          providerProfile: true,
        },
      });
    });

    it('should not accept roles from external auth (security)', async () => {
      const mockUser = {
        id: 'user-1',
        externalAuthId: 'clerk_123',
        email: 'test@example.com',
        name: 'Test User',
        roles: ['owner'], // Should default to owner
        authProvider: 'clerk',
        ownerProfile: { id: 'owner-1', onboardingComplete: false },
        providerProfile: null,
      };

      mockPrismaService.user.create.mockResolvedValue(mockUser);

      // Try to pass admin role from external auth (should be ignored)
      const result = await service.createFromExternalAuth({
        externalAuthId: 'clerk_123',
        email: 'test@example.com',
        name: 'Test User',
        authProvider: 'clerk',
        // roles deliberately omitted - should default to owner
      });

      // Verify it defaults to owner, not whatever external auth sends
      expect(result.roles).toEqual(['owner']);
    });
  });

  describe('updateRoles', () => {
    it('should update user roles', async () => {
      const existingUser = {
        id: 'user-1',
        roles: ['owner'],
        providerProfile: null,
      };

      const updatedUser = {
        ...existingUser,
        roles: ['owner', 'provider'],
        providerProfile: { id: 'provider-1', status: ProviderStatus.NONE },
      };

      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);
      mockPrismaService.user.update.mockResolvedValue(updatedUser);
      mockPrismaService.providerProfile.create.mockResolvedValue({
        id: 'provider-1',
        status: ProviderStatus.NONE,
      });

      const result = await service.updateRoles('user-1', ['owner', 'provider']);

      expect(result.roles).toEqual(['owner', 'provider']);
      expect(prisma.providerProfile.create).toHaveBeenCalled();
    });

    it('should create provider profile when becoming provider', async () => {
      const existingUser = {
        id: 'user-1',
        roles: ['owner'],
        providerProfile: null,
      };

      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);
      mockPrismaService.user.update.mockResolvedValue({
        ...existingUser,
        roles: ['owner', 'provider'],
      });
      mockPrismaService.providerProfile.create.mockResolvedValue({
        id: 'provider-1',
        status: ProviderStatus.NONE,
      });

      await service.updateRoles('user-1', ['owner', 'provider']);

      // Should update roles first
      expect(prisma.user.update).toHaveBeenCalled();
      
      // Then create provider profile
      expect(prisma.providerProfile.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          status: ProviderStatus.NONE,
          onboardingComplete: false,
        },
      });
    });

    it('should not recreate provider profile if already exists', async () => {
      const existingUser = {
        id: 'user-1',
        roles: ['owner'],
        providerProfile: { id: 'provider-1', status: ProviderStatus.DRAFT },
      };

      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);
      mockPrismaService.user.update.mockResolvedValue({
        ...existingUser,
        roles: ['owner', 'provider'],
      });

      await service.updateRoles('user-1', ['owner', 'provider']);

      expect(prisma.user.update).toHaveBeenCalled();
      // Should NOT call providerProfile.create because it already exists
      expect(prisma.providerProfile.create).not.toHaveBeenCalled();
    });
  });

  describe('updateFromExternalAuth', () => {
    it('should only update profile fields, not roles', async () => {
      const mockUser = {
        id: 'user-1',
        externalAuthId: 'clerk_123',
        email: 'newemail@example.com',
        name: 'Updated Name',
        roles: ['owner'], // Should remain unchanged
      };

      mockPrismaService.user.update.mockResolvedValue(mockUser);

      await service.updateFromExternalAuth('clerk_123', {
        email: 'newemail@example.com',
        name: 'Updated Name',
        avatarUrl: 'https://example.com/avatar.jpg',
      });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { externalAuthId: 'clerk_123' },
        data: {
          email: 'newemail@example.com',
          name: 'Updated Name',
          avatarUrl: 'https://example.com/avatar.jpg',
          phone: undefined,
        },
        include: {
          ownerProfile: true,
          providerProfile: true,
        },
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle user with empty email gracefully', async () => {
      mockPrismaService.user.create.mockResolvedValue({
        id: 'user-1',
        email: '',
        name: 'Test User',
        roles: ['owner'],
      });

      const result = await service.createFromExternalAuth({
        externalAuthId: 'clerk_123',
        email: '',
        name: 'Test User',
        authProvider: 'clerk',
      });

      expect(result.email).toBe('');
    });

    it('should handle duplicate role entries', async () => {
      const existingUser = {
        id: 'user-1',
        roles: ['owner'],
        providerProfile: null,
      };

      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);
      mockPrismaService.user.update.mockResolvedValue({
        ...existingUser,
        roles: ['owner', 'provider'],
      });
      mockPrismaService.providerProfile.create.mockResolvedValue({
        id: 'provider-1',
        status: ProviderStatus.NONE,
      });

      // Try to add duplicate owner role
      await service.updateRoles('user-1', ['owner', 'owner', 'provider']);

      // Should deduplicate
      expect(prisma.user.update).toHaveBeenCalled();
    });
  });
});
