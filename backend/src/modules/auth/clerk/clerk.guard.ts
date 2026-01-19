import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { createClerkClient, verifyToken } from '@clerk/backend';
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
  private readonly clerkClient;
  private readonly secretKey: string;

  constructor(
    private reflector: Reflector,
    private configService: ConfigService,
    private clerkAuthService: ClerkAuthService,
  ) {
    this.secretKey = this.configService.get<string>('CLERK_SECRET_KEY') || '';
    this.clerkClient = createClerkClient({
      secretKey: this.secretKey,
    });
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
        // User exists in Clerk but not in our DB yet (webhook might be delayed)
        // Try to fetch from Clerk and create
        try {
          this.logger.log(`User not found in DB, fetching from Clerk: ${clerkUserId}`);
          const clerkUser = await this.clerkClient.users.getUser(clerkUserId);
          
          const email = clerkUser.emailAddresses[0]?.emailAddress;
          const phone = clerkUser.phoneNumbers[0]?.phoneNumber;
          
          // Clerk might have phone-only users
          if (!email && !phone) {
            throw new Error('User has no email or phone number');
          }

          const newUser = await this.clerkAuthService.createFromExternalAuth({
            externalAuthId: clerkUserId,
            email: email || phone || '', // Use phone if no email
            name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User',
            phone: phone,
            avatarUrl: clerkUser.imageUrl,
            authProvider: 'clerk',
            roles: [clerkUser.unsafeMetadata?.role as string || 'owner'],
          });
          this.logger.log(`Created new user: ${newUser.id}`);
          request.user = newUser;
        } catch (createError) {
          this.logger.error(`Failed to create user from Clerk: ${createError instanceof Error ? createError.message : createError}`);
          throw createError;
        }
      } else {
        request.user = user;
      }

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
