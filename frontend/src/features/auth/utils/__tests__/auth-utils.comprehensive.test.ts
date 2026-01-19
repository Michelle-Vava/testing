import { describe, it, expect, beforeEach } from 'vitest';
import { hasRole, getPrimaryRole, canAccessOwner, canAccessProvider, getUserRoles } from '../auth-utils';
import type { UserEntity } from '@/services/generated/model';

describe('auth-utils - Comprehensive Role Tests', () => {
  describe('hasRole - Advanced Scenarios', () => {
    it('should handle case-sensitive role matching', () => {
      const user = { roles: ['owner'] } as UserEntity;
      expect(hasRole(user, 'Owner')).toBe(false);
      expect(hasRole(user, 'OWNER')).toBe(false);
      expect(hasRole(user, 'owner')).toBe(true);
    });

    it('should handle special characters in role names', () => {
      const user = { roles: ['super-admin', 'beta_tester'] } as UserEntity;
      expect(hasRole(user, 'super-admin')).toBe(true);
      expect(hasRole(user, 'beta_tester')).toBe(true);
    });

    it('should handle whitespace in roles', () => {
      const user = { roles: ['owner', ' provider ', '  admin'] } as UserEntity;
      expect(hasRole(user, ' provider ')).toBe(true);
      expect(hasRole(user, 'provider')).toBe(false); // Exact match required
    });

    it('should handle very long role names', () => {
      const longRole = 'super-mega-ultra-premium-enterprise-administrator-with-full-access';
      const user = { roles: [longRole] } as UserEntity;
      expect(hasRole(user, longRole)).toBe(true);
    });

    it('should handle empty string role', () => {
      const user = { roles: ['', 'owner'] } as UserEntity;
      expect(hasRole(user, '')).toBe(true);
      expect(hasRole(user, 'owner')).toBe(true);
    });
  });

  describe('getPrimaryRole - Edge Cases', () => {
    it('should return first role even if empty string', () => {
      const user = { roles: ['', 'owner'] } as UserEntity;
      expect(getPrimaryRole(user)).toBe('');
    });

    it('should handle single role user', () => {
      const user = { roles: ['provider'] } as UserEntity;
      expect(getPrimaryRole(user)).toBe('provider');
    });

    it('should handle many roles user', () => {
      const user = { roles: ['admin', 'owner', 'provider', 'moderator', 'support'] } as UserEntity;
      expect(getPrimaryRole(user)).toBe('admin');
    });

    it('should return undefined for roles array with undefined values', () => {
      const user = { roles: [undefined, 'owner'] } as any;
      // getPrimaryRole returns first element, even if undefined
      expect(getPrimaryRole(user)).toBeUndefined();
    });
  });

  describe('canAccessProvider - Provider Status Logic', () => {
    it('should allow ACTIVE provider', () => {
      const user = {
        roles: ['provider'],
        providerStatus: 'ACTIVE',
      } as any;
      expect(canAccessProvider(user)).toBe(true);
    });

    it('should allow LIMITED provider', () => {
      const user = {
        roles: ['provider'],
        providerStatus: 'LIMITED',
      } as any;
      expect(canAccessProvider(user)).toBe(true);
    });

    it('should deny DRAFT provider', () => {
      const user = {
        roles: ['provider'],
        providerStatus: 'DRAFT',
      } as any;
      expect(canAccessProvider(user)).toBe(false);
    });

    it('should deny NONE provider', () => {
      const user = {
        roles: ['provider'],
        providerStatus: 'NONE',
      } as any;
      expect(canAccessProvider(user)).toBe(false);
    });

    it('should deny SUSPENDED provider', () => {
      const user = {
        roles: ['provider'],
        providerStatus: 'SUSPENDED',
      } as any;
      expect(canAccessProvider(user)).toBe(false);
    });

    it('should deny provider with undefined status', () => {
      const user = {
        roles: ['provider'],
        providerStatus: undefined,
      } as any;
      expect(canAccessProvider(user)).toBe(false);
    });

    it('should deny provider with null status', () => {
      const user = {
        roles: ['provider'],
        providerStatus: null,
      } as any;
      expect(canAccessProvider(user)).toBe(false);
    });

    it('should deny provider with invalid status', () => {
      const user = {
        roles: ['provider'],
        providerStatus: 'INVALID_STATUS',
      } as any;
      expect(canAccessProvider(user)).toBe(false);
    });
  });

  describe('canAccessOwner - Simple Role Check', () => {
    it('should allow owner role', () => {
      const user = { roles: ['owner'] } as UserEntity;
      expect(canAccessOwner(user)).toBe(true);
    });

    it('should allow owner with multiple roles', () => {
      const user = { roles: ['provider', 'owner', 'admin'] } as UserEntity;
      expect(canAccessOwner(user)).toBe(true);
    });

    it('should deny non-owner', () => {
      const user = { roles: ['provider'] } as UserEntity;
      expect(canAccessOwner(user)).toBe(false);
    });

    it('should deny empty roles', () => {
      const user = { roles: [] } as UserEntity;
      expect(canAccessOwner(user)).toBe(false);
    });

    it('should deny null user', () => {
      expect(canAccessOwner(null)).toBe(false);
    });
  });

  describe('getUserRoles - Mutation Safety', () => {
    it('should return a copy, not reference', () => {
      const user = { roles: ['owner', 'provider'] } as UserEntity;
      const roles1 = getUserRoles(user);
      const roles2 = getUserRoles(user);
      
      expect(roles1).not.toBe(roles2); // Different references
      expect(roles1).toEqual(roles2); // Same content
    });

    it('should not mutate original array when modifying result', () => {
      const originalRoles = ['owner', 'provider'];
      const user = { roles: originalRoles } as UserEntity;
      
      const result = getUserRoles(user);
      result.push('admin');
      result[0] = 'modified';
      
      expect(user.roles).toEqual(['owner', 'provider']); // Unchanged
      expect(originalRoles).toEqual(['owner', 'provider']); // Unchanged
    });

    it('should return empty array for null user', () => {
      expect(getUserRoles(null)).toEqual([]);
    });

    it('should return empty array for undefined roles', () => {
      const user = { roles: undefined } as any;
      expect(getUserRoles(user)).toEqual([]);
    });

    it('should return empty array for null roles', () => {
      const user = { roles: null } as any;
      expect(getUserRoles(user)).toEqual([]);
    });
  });

  describe('Security Tests', () => {
    it('should not allow script injection in role names', () => {
      const maliciousRole = '<script>alert("xss")</script>';
      const user = { roles: [maliciousRole] } as UserEntity;
      expect(hasRole(user, maliciousRole)).toBe(true);
      expect(getPrimaryRole(user)).toBe(maliciousRole); // Just stored, not executed
    });

    it('should handle SQL-like strings in roles', () => {
      const sqlRole = "'; DROP TABLE users; --";
      const user = { roles: [sqlRole] } as UserEntity;
      expect(hasRole(user, sqlRole)).toBe(true);
    });

    it('should handle unicode characters in roles', () => {
      const unicodeRole = '管理者'; // "Administrator" in Japanese
      const user = { roles: [unicodeRole, 'owner'] } as UserEntity;
      expect(hasRole(user, unicodeRole)).toBe(true);
    });
  });

  describe('Performance Tests', () => {
    it('should handle large number of roles efficiently', () => {
      const manyRoles = Array.from({ length: 1000 }, (_, i) => `role_${i}`);
      const user = { roles: manyRoles } as UserEntity;
      
      const start = performance.now();
      const result = hasRole(user, 'role_999');
      const end = performance.now();
      
      expect(result).toBe(true);
      expect(end - start).toBeLessThan(10); // Should complete in <10ms
    });

    it('should handle getUserRoles with large arrays', () => {
      const manyRoles = Array.from({ length: 10000 }, (_, i) => `role_${i}`);
      const user = { roles: manyRoles } as UserEntity;
      
      const start = performance.now();
      const result = getUserRoles(user);
      const end = performance.now();
      
      expect(result).toHaveLength(10000);
      expect(end - start).toBeLessThan(50); // Should complete in <50ms
    });
  });

  describe('Multi-Role Users', () => {
    it('should support user with both owner and provider roles', () => {
      const user = {
        roles: ['owner', 'provider'],
        providerStatus: 'ACTIVE',
      } as any;
      
      expect(canAccessOwner(user)).toBe(true);
      expect(canAccessProvider(user)).toBe(true);
      expect(getPrimaryRole(user)).toBe('owner');
    });

    it('should prioritize first role as primary', () => {
      const user = {
        roles: ['provider', 'owner', 'admin'],
        providerStatus: 'ACTIVE',
      } as any;
      
      expect(getPrimaryRole(user)).toBe('provider');
      expect(canAccessOwner(user)).toBe(true); // Still has owner
      expect(canAccessProvider(user)).toBe(true);
    });

    it('should handle role switching scenario', () => {
      // User starts as owner
      let user = { roles: ['owner'] } as UserEntity;
      expect(getPrimaryRole(user)).toBe('owner');
      
      // Becomes provider (added to end)
      user = { roles: ['owner', 'provider'], providerStatus: 'ACTIVE' } as any;
      expect(getPrimaryRole(user)).toBe('owner'); // Still primary
      
      // Switches primary to provider (reordered)
      user = { roles: ['provider', 'owner'], providerStatus: 'ACTIVE' } as any;
      expect(getPrimaryRole(user)).toBe('provider'); // Now primary
    });
  });
});
