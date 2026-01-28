/**
 * User roles - simple type instead of enum
 * owner: Can create service requests, add vehicles
 * provider: Can submit quotes on requests, manage jobs
 */
export type UserRole = 'owner' | 'provider';

export const UserRoles = {
  OWNER: 'owner' as UserRole,
  PROVIDER: 'provider' as UserRole,
} as const;
