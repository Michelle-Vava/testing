import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../enums/user-role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * RolesGuard - Authorization guard that restricts endpoint access based on user roles
 * 
 * Checks if the authenticated user has one of the required roles specified by @Roles() decorator.
 * This guard relies on ClerkAuthGuard (global) to ensure user is already authenticated.
 * 
 * @example
 * ```typescript
 * @Roles(UserRole.PROVIDER, UserRole.ADMIN)
 * @UseGuards(RolesGuard)
 * async updateProviderProfile() {
 *   // Only providers and admins can access
 * }
 * ```
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Determines if the current user has one of the required roles to access the endpoint
   * 
   * @param context - Execution context containing request and handler metadata
   * @returns true if user has required role, false otherwise
   * @throws ForbiddenException when user lacks required role
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    // If no roles specified, allow access
    if (!requiredRoles) {
      return true;
    }
    
    const { user } = context.switchToHttp().getRequest();
    
    // If no user attached (auth failed) or user has no roles, deny access
    if (!user || !user.roles) {
      throw new ForbiddenException('Authentication required');
    }

    // Check if user has at least one of the required roles
    const hasRole = requiredRoles.some((role) => user.roles.includes(role));
    
    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied. Required roles: ${requiredRoles.join(', ')}`
      );
    }

    return true;
  }
}
