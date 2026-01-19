import { describe, it, expect } from 'vitest';
import {
  hasRole,
  getPrimaryRole,
  canAccessOwner,
  canAccessProvider,
  getUserRoles,
} from '../auth-utils';
import type { UserEntity } from '@/types/user';

describe('auth-utils - Role Helper Functions', () => {
  describe('hasRole', () => {
    it('should return true when user has the role', () => {
      const user: Partial<UserEntity> = {
        roles: ['owner', 'provider'],
      };

      expect(hasRole(user as UserEntity, 'owner')).toBe(true);
      expect(hasRole(user as UserEntity, 'provider')).toBe(true);
    });

    it('should return false when user does not have the role', () => {
      const user: Partial<UserEntity> = {
        roles: ['owner'],
      };

      expect(hasRole(user as UserEntity, 'provider')).toBe(false);
    });

    it('should handle empty roles array', () => {
      const user: Partial<UserEntity> = {
        roles: [],
      };

      expect(hasRole(user as UserEntity, 'owner')).toBe(false);
    });

    it('should handle undefined roles', () => {
      const user: Partial<UserEntity> = {
        roles: undefined,
      };

      expect(hasRole(user as UserEntity, 'owner')).toBe(false);
    });

    it('should handle null user', () => {
      expect(hasRole(null as any, 'owner')).toBe(false);
    });

    it('should be case-sensitive', () => {
      const user: Partial<UserEntity> = {
        roles: ['owner'],
      };

      expect(hasRole(user as UserEntity, 'Owner')).toBe(false);
    });
  });

  describe('getPrimaryRole', () => {
    it('should return first role as primary', () => {
      const user: Partial<UserEntity> = {
        roles: ['owner', 'provider'],
      };

      expect(getPrimaryRole(user as UserEntity)).toBe('owner');
    });

    it('should return owner as fallback when roles is empty', () => {
      const user: Partial<UserEntity> = {
        roles: [],
      };

      expect(getPrimaryRole(user as UserEntity)).toBe('owner');
    });

    it('should handle null user', () => {
      expect(getPrimaryRole(null as any)).toBe('owner');
    });
  });

  describe('getUserRoles', () => {
    it('should return all user roles', () => {
      const user: Partial<UserEntity> = {
        roles: ['owner', 'provider'],
      };

      expect(getUserRoles(user as UserEntity)).toEqual(['owner', 'provider']);
    });

    it('should return empty array for no roles', () => {
      const user: Partial<UserEntity> = {
        roles: [],
      };

      expect(getUserRoles(user as UserEntity)).toEqual([]);
    });
  });

  describe('canAccessOwner', () => {
    it('should return true for owner role', () => {
      const user: Partial<UserEntity> = {
        roles: ['owner'],
      };

      expect(canAccessOwner(user as UserEntity)).toBe(true);
    });

    it('should return false for provider only', () => {
      const user: Partial<UserEntity> = {
        roles: ['provider'],
      };

      expect(canAccessOwner(user as UserEntity)).toBe(false);
    });
  });

  describe('canAccessProvider', () => {
    it('should return true for provider with ACTIVE status', () => {
      const user: Partial<UserEntity> = {
        roles: ['provider'],
        providerStatus: 'ACTIVE' as any,
      };

      expect(canAccessProvider(user as UserEntity)).toBe(true);
    });

    it('should return false for DRAFT status', () => {
      const user: Partial<UserEntity> = {
        roles: ['provider'],
        providerStatus: 'DRAFT' as any,
      };

      expect(canAccessProvider(user as UserEntity)).toBe(false);
    });

    it('should return false for owner without provider role', () => {
      const user: Partial<UserEntity> = {
        roles: ['owner'],
        providerStatus: 'ACTIVE' as any,
      };

      expect(canAccessProvider(user as UserEntity)).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle duplicate roles', () => {
      const user: Partial<UserEntity> = {
        roles: ['owner', 'owner', 'provider'],
      };

      expect(hasRole(user as UserEntity, 'owner')).toBe(true);
      expect(getUserRoles(user as UserEntity)).toEqual(['owner', 'owner', 'provider']);
    });

    it('should handle special characters in role names', () => {
      const user: Partial<UserEntity> = {
        roles: ['owner', 'provider@premium'],
      };

      expect(hasRole(user as UserEntity, 'provider@premium')).toBe(true);
    });

    it('should not mutate original array', () => {
      const originalRoles = ['owner', 'provider'];
      const user: Partial<UserEntity> = {
        roles: originalRoles,
      };

      const result = getUserRoles(user as UserEntity);
      result.push('admin');

      expect(user.roles).toEqual(['owner', 'provider']);
    });
  });
});
