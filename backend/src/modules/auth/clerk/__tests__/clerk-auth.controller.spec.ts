import { Test, TestingModule } from '@nestjs/testing';
import { ClerkAuthController } from '../clerk-auth.controller';
import { ClerkAuthService } from '../clerk-auth.service';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';

describe('ClerkAuthController - Role Endpoints', () => {
  let controller: ClerkAuthController;
  let authService: ClerkAuthService;

  const mockAuthService = {
    updateRoles: jest.fn(),
    findByClerkId: jest.fn(),
    getCurrentUser: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('test_webhook_secret'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClerkAuthController],
      providers: [
        {
          provide: ClerkAuthService,
          useValue: mockAuthService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<ClerkAuthController>(ClerkAuthController);
    authService = module.get<ClerkAuthService>(ClerkAuthService);
    jest.clearAllMocks();
  });

  describe('updateRolesAlt', () => {
    it('should update user roles successfully', async () => {
      const mockUser = { id: 'user123', roles: ['owner'] };
      const updateDto = { roles: ['owner', 'provider'] };
      const updatedUser = { ...mockUser, roles: updateDto.roles };

      mockAuthService.updateRoles.mockResolvedValue(updatedUser);

      const result = await controller.updateRolesAlt(mockUser as any, updateDto);

      expect(authService.updateRoles).toHaveBeenCalledWith('user123', updateDto.roles);
      expect(result.roles).toEqual(['owner', 'provider']);
    });

    it('should handle single role update', async () => {
      const mockUser = { id: 'user456', roles: ['owner', 'provider'] };
      const updateDto = { roles: ['owner'] };

      mockAuthService.updateRoles.mockResolvedValue({ ...mockUser, roles: ['owner'] });

      await controller.updateRolesAlt(mockUser as any, updateDto);

      expect(authService.updateRoles).toHaveBeenCalledWith('user456', ['owner']);
    });
  });

  describe('setPrimaryRole', () => {
    it('should reorder roles to set primary role', async () => {
      const mockUser = {
        id: 'user789',
        roles: ['owner', 'provider'],
      };
      const setPrimaryRoleDto = { primaryRole: 'provider' };

      const reorderedUser = {
        ...mockUser,
        roles: ['provider', 'owner'],
      };

      mockAuthService.updateRoles.mockResolvedValue(reorderedUser);

      const result = await controller.setPrimaryRole(
        mockUser as any,
        setPrimaryRoleDto,
      );

      expect(authService.updateRoles).toHaveBeenCalledWith('user789', [
        'provider',
        'owner',
      ]);
      expect(result.roles[0]).toBe('provider');
    });

    it('should throw error if user does not have the role', async () => {
      const mockUser = {
        id: 'user999',
        roles: ['owner'],
      };
      const setPrimaryRoleDto = { primaryRole: 'provider' };

      await expect(
        controller.setPrimaryRole(mockUser as any, setPrimaryRoleDto),
      ).rejects.toThrow('User does not have role: provider');

      expect(authService.updateRoles).not.toHaveBeenCalled();
    });

    it('should handle setting already primary role (no change)', async () => {
      const mockUser = {
        id: 'user111',
        roles: ['owner', 'provider'],
      };
      const setPrimaryRoleDto = { primaryRole: 'owner' };

      mockAuthService.updateRoles.mockResolvedValue(mockUser);

      const result = await controller.setPrimaryRole(
        mockUser as any,
        setPrimaryRoleDto,
      );

      // Should still call but array stays same
      expect(authService.updateRoles).toHaveBeenCalledWith('user111', [
        'owner',
        'provider',
      ]);
    });
  });

  describe('Edge Cases - Role Management', () => {
    it('should handle empty roles array in setPrimaryRole', async () => {
      const mockUser = {
        id: 'user222',
        roles: [],
      };
      const setPrimaryRoleDto = { primaryRole: 'owner' };

      await expect(
        controller.setPrimaryRole(mockUser as any, setPrimaryRoleDto),
      ).rejects.toThrow();
    });

    it('should handle case-sensitive role names', async () => {
      const mockUser = {
        id: 'user333',
        roles: ['owner', 'provider'],
      };
      const setPrimaryRoleDto = { primaryRole: 'Provider' }; // Wrong case

      await expect(
        controller.setPrimaryRole(mockUser as any, setPrimaryRoleDto),
      ).rejects.toThrow('User does not have role: Provider');
    });

    it('should handle special characters in role names', async () => {
      const mockUser = {
        id: 'user444',
        roles: ['owner'],
      };
      const updateDto = { roles: ['owner', 'provider@special'] };

      mockAuthService.updateRoles.mockResolvedValue({
        ...mockUser,
        roles: updateDto.roles,
      });

      const result = await controller.updateRolesAlt(mockUser as any, updateDto);

      expect(result.roles).toContain('provider@special');
    });

    it('should handle very long roles array', async () => {
      const mockUser = { id: 'user555', roles: ['owner'] };
      const longRolesArray = Array.from({ length: 100 }, (_, i) => `role${i}`);
      const updateDto = { roles: longRolesArray };

      mockAuthService.updateRoles.mockResolvedValue({
        ...mockUser,
        roles: longRolesArray,
      });

      const result = await controller.updateRolesAlt(mockUser as any, updateDto);

      expect(result.roles.length).toBe(100);
    });

    it('should handle null/undefined in setPrimaryRole', async () => {
      const mockUser = {
        id: 'user666',
        roles: ['owner'],
      };

      await expect(
        controller.setPrimaryRole(mockUser as any, { primaryRole: null as any }),
      ).rejects.toThrow();

      await expect(
        controller.setPrimaryRole(mockUser as any, {
          primaryRole: undefined as any,
        }),
      ).rejects.toThrow();
    });

    it('should handle concurrent role updates', async () => {
      const mockUser = {
        id: 'user777',
        roles: ['owner'],
      };

      const updateDto1 = { roles: ['owner', 'provider'] };
      const updateDto2 = { roles: ['provider'] };

      mockAuthService.updateRoles
        .mockResolvedValueOnce({ ...mockUser, roles: updateDto1.roles })
        .mockResolvedValueOnce({ ...mockUser, roles: updateDto2.roles });

      // Simulate concurrent calls
      const [result1, result2] = await Promise.all([
        controller.updateRolesAlt(mockUser as any, updateDto1),
        controller.updateRolesAlt(mockUser as any, updateDto2),
      ]);

      expect(authService.updateRoles).toHaveBeenCalledTimes(2);
    });
  });
});
