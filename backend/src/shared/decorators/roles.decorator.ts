import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../enums/user-role.enum';

/**
 * Metadata key for storing required roles
 */
export const ROLES_KEY = 'roles';

/**
 * Roles decorator to specify which user roles are allowed to access an endpoint
 * 
 * Use with RolesGuard to enforce role-based access control (RBAC).
 * ClerkAuthGuard is applied globally, so user is already authenticated.
 * 
 * @param roles - Array of allowed user roles (UserRole enum values)
 * @returns Metadata decorator
 * 
 * @example
 * ```typescript
 * @Roles(UserRole.ADMIN, UserRole.PROVIDER)
 * @UseGuards(RolesGuard)
 * async getProviderStats() {
 *   // Only admins and providers can access this
 * }
 * ```
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

