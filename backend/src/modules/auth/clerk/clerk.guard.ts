import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { verifyToken } from '@clerk/backend';
import { ClerkAuthService } from './clerk-auth.service';

/**
 * ClerkAuthGuard - Validates Clerk JWT tokens and attaches user to request
 * 
 * This guard is auth-provider agnostic - can be swapped for Auth0/Supabase
 * by changing the token validation logic.
 */
@Injectable()
export class ClerkAuthGuard implements CanActivate {
  private readonly logger = new Logger(ClerkAuthGuard.name);
  private readonly secretKey: string;

  constructor(
    private reflector: Reflector,
    private configService: ConfigService,
    private clerkAuthService: ClerkAuthService,
  ) {
    this.secretKey = this.configService.get<string>('CLERK_SECRET_KEY') || '';
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route is marked as public
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('No authorization token provided');
    }

    try {
      // Verify the Clerk JWT token using the verifyToken function
      const payload = await verifyToken(token, {
        secretKey: this.secretKey,
      });

      const clerkUserId = payload.sub;

      if (!clerkUserId) {
        throw new UnauthorizedException('Invalid token');
      }

      // Find user in our database by Clerk ID
      const user = await this.clerkAuthService.findByExternalId(clerkUserId);

      if (!user) {
        this.logger.error(`User not found in database: ${clerkUserId}`);
        throw new UnauthorizedException('User not found - webhook sync may have failed');
      }

      request.user = user;

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Auth error: ${errorMessage}`);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractToken(request: any): string | null {
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    return null;
  }
}
