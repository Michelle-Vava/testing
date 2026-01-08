import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

/**
 * CSRF Protection Guard using double-submit cookie pattern
 * 
 * Validates that:
 * 1. Request has a csrf_token cookie (httpOnly: false, set by backend)
 * 2. Request has X-CSRF-Token header
 * 3. Cookie value matches header value
 * 
 * Applied to all mutation endpoints (POST, PUT, PATCH, DELETE).
 * Skipped for GET/HEAD/OPTIONS requests.
 * 
 * @decorator @SkipCsrf() can be used to skip CSRF protection on specific routes
 */
@Injectable()
export class CsrfGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    
    // Skip CSRF for safe methods (GET, HEAD, OPTIONS)
    const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
    if (safeMethods.includes(request.method)) {
      return true;
    }

    // Check for @SkipCsrf() decorator
    const skipCsrf = this.reflector.get<boolean>('skipCsrf', context.getHandler());
    if (skipCsrf) {
      return true;
    }

    // Get CSRF token from cookie and header
    const cookieToken = request.cookies?.csrf_token;
    const headerToken = request.headers['x-csrf-token'] as string;

    // Both must exist and match
    if (!cookieToken || !headerToken || cookieToken !== headerToken) {
      throw new ForbiddenException('Invalid CSRF token');
    }

    return true;
  }
}
