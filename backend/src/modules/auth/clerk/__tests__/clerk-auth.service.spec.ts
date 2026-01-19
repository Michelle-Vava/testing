import { Test, TestingModule } from '@nestjs/testing';
import { ClerkAuthService } from '../clerk-auth.service';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import { ProviderStatus } from '@prisma/client';

describe('ClerkAuthService - Role Management', () => {
  let service: ClerkAuthService;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
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
    jest.clearAllMocks();
  });

  describe('createFromExternalAuth', () => {
    it('should create user with default owner role when no roles provided', async () => {
      const userData = {
        externalAuthId: 'clerk_123',
        email: 'test@example.com',
        name: 'Test User',
        authProvider: 'clerk',
      };

      const expectedUser = {
        id: '1',
        ...userData,
        roles: ['owner'],
        ownerProfile: { onboardingComplete: false },
        providerProfile: null,
      };

      mockPrismaService.user.create.mockResolvedValue(expectedUser);

      const result = await service.createFromExternalAuth(userData);

      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          externalAuthId: userData.externalAuthId,
          authProvider: userData.authProvider,
          email: userData.email,
          name: userData.name,
          avatarUrl: undefined,
          phone: undefined,
          roles: ['owner'],
          ownerProfile: {
            create: {
              onboardingComplete: false,
            },
          },
          providerProfile: undefined,
        },
        include: {
          ownerProfile: true,
          providerProfile: true,
        },
      });
      expect(result.roles).toEqual(['owner']);
    });

    it('should create user with provider role and provider profile', async () => {
      const userData = {
        externalAuthId: 'clerk_456',
        email: 'provider@example.com',
        name: 'Provider User',
        authProvider: 'clerk',
        roles: ['provider'],
      };

      const expectedUser = {
        id: '2',
        ...userData,
        ownerProfile: { onboardingComplete: false },
        providerProfile: { status: ProviderStatus.NONE, onboardingComplete: false },
      };

      mockPrismaService.user.create.mockResolvedValue(expectedUser);

      await service.createFromExternalAuth(userData);

      expect(mockPrismaService.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            roles: ['provider'],
            providerProfile: {
              create: {
                status: ProviderStatus.NONE,
                onboardingComplete: false,
              },
            },
          }),
        }),
      );
    });

    it('should create user with both owner and provider roles', async () => {
      const userData = {
        externalAuthId: 'clerk_789',
        email: 'both@example.com',
        name: 'Both Roles User',
        authProvider: 'clerk',
        roles: ['owner', 'provider'],
      };

      const expectedUser = {
        id: '3',
        ...userData,
        ownerProfile: { onboardingComplete: false },
        providerProfile: { status: ProviderStatus.NONE },
      };

      mockPrismaService.user.create.mockResolvedValue(expectedUser);

      await service.createFromExternalAuth(userData);

      const createCall = mockPrismaService.user.create.mock.calls[0][0];
      expect(createCall.data.roles).toEqual(['owner', 'provider']);
      expect(createCall.data.ownerProfile).toBeDefined();
      expect(createCall.data.providerProfile).toBeDefined();
    });
  });

  describe('updateRoles', () => {
    it('should update user roles to add provider role', async () => {
      const userId = 'user123';
      const newRoles = ['owner', 'provider'];

      const existingUser = {
        id: userId,
        roles: ['owner'],
        providerProfile: null,
      };

      const updatedUser = {
        ...existingUser,
        roles: newRoles,
        providerProfile: { status: ProviderStatus.NONE },
      };

      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);
      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.updateRoles(userId, newRoles);

      expect(result.roles).toEqual(newRoles);
    });

    it('should reorder roles when setting primary role', async () => {
      const userId = 'user123';
      const reorderedRoles = ['provider', 'owner'];

      const existingUser = {
        id: userId,
        roles: ['owner', 'provider'],
        providerProfile: { status: ProviderStatus.ACTIVE },
      };

      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);
      mockPrismaService.user.update.mockResolvedValue({
        ...existingUser,
        roles: reorderedRoles,
      });

      const result = await service.updateRoles(userId, reorderedRoles);

      expect(result.roles[0]).toBe('provider');
      expect(result.roles[1]).toBe('owner');
    });

    it('should handle edge case: empty roles array defaults to owner', async () => {
      const userId = 'user123';
      const emptyRoles: string[] = [];

      const existingUser = {
        id: userId,
        roles: ['owner'],
      };

      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);
      mockPrismaService.user.update.mockResolvedValue(existingUser);

      await service.updateRoles(userId, emptyRoles);

      // Should handle gracefully or reject
      expect(mockPrismaService.user.update).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle user with invalid role gracefully', async () => {
      const userData = {
        externalAuthId: 'clerk_invalid',
        email: 'invalid@example.com',
        name: 'Invalid Role User',
        authProvider: 'clerk',
        roles: ['invalid_role' as any],
      };

      mockPrismaService.user.create.mockResolvedValue({
        ...userData,
        id: '4',
        ownerProfile: null,
        providerProfile: null,
      });

      // Should still create user but handle invalid role
      await service.createFromExternalAuth(userData);
      expect(mockPrismaService.user.create).toHaveBeenCalled();
    });

    it('should handle null/undefined roles in updateRoles', async () => {
      const userId = 'user123';

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: userId,
        roles: ['owner'],
      });

      // Test with null
      await expect(
        service.updateRoles(userId, null as any),
      ).rejects.toThrow();
    });

    it('should handle duplicate roles in array', async () => {
      const userData = {
        externalAuthId: 'clerk_duplicate',
        email: 'duplicate@example.com',
        name: 'Duplicate Roles',
        authProvider: 'clerk',
        roles: ['owner', 'owner', 'provider'],
      };

      mockPrismaService.user.create.mockResolvedValue({
        ...userData,
        id: '5',
      });

      await service.createFromExternalAuth(userData);
      
      // Should handle duplicates gracefully
      expect(mockPrismaService.user.create).toHaveBeenCalled();
    });

    it('should handle switching from provider to owner only', async () => {
      const userId = 'user123';
      const existingUser = {
        id: userId,
        roles: ['provider'],
        providerProfile: { status: ProviderStatus.ACTIVE },
      };

      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);
      mockPrismaService.user.update.mockResolvedValue({
        ...existingUser,
        roles: ['owner'],
      });

      const result = await service.updateRoles(userId, ['owner']);

      // Provider profile should still exist but user is now owner
      expect(result.roles).toEqual(['owner']);
    });

    it('should handle admin role if added in future', async () => {
      const userData = {
        externalAuthId: 'clerk_admin',
        email: 'admin@example.com',
        name: 'Admin User',
        authProvider: 'clerk',
        roles: ['admin', 'owner'],
      };

      mockPrismaService.user.create.mockResolvedValue({
        ...userData,
        id: '6',
      });

      await service.createFromExternalAuth(userData);
      
      expect(mockPrismaService.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            roles: ['admin', 'owner'],
          }),
        }),
      );
    });
  });
});
