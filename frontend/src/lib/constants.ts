export const UserRoles = {
  OWNER: 'owner',
  PROVIDER: 'provider',
  ADMIN: 'admin',
} as const;

export type UserRoleType = typeof UserRoles[keyof typeof UserRoles];
