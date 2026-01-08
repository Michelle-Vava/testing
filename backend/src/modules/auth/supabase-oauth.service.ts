import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { UserEntity } from './entities/user.entity';

/**
 * SupabaseOAuthService - Handles OAuth token exchange
 * 
 * Validates Supabase OAuth tokens and exchanges them for our custom JWT tokens.
 * This ensures we have ONE canonical authentication system (our JWT).
 */
@Injectable()
export class SupabaseOAuthService {
  private readonly logger = new Logger(SupabaseOAuthService.name);
  private supabase;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration missing');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Handle OAuth callback - validate Supabase token and issue our JWT
   * 
   * Flow:
   * 1. Validate token with Supabase
   * 2. Extract user email/name from Supabase user
   * 3. Find or create user in our database
   * 4. Issue OUR JWT token
   * 
   * @param supabaseToken - Token from Supabase OAuth flow
   * @returns Our custom JWT and user data
   */
  async handleOAuthCallback(supabaseToken: string) {
    try {
      // Validate token with Supabase
      const { data: { user: supabaseUser }, error } = await this.supabase.auth.getUser(supabaseToken);

      if (error || !supabaseUser || !supabaseUser.email) {
        this.logger.warn(`OAuth validation failed: ${error?.message || 'No user data'}`);
        throw new UnauthorizedException('Invalid OAuth token');
      }

      this.logger.log(`OAuth user authenticated: ${supabaseUser.email}`);

      // Find or create user in our database
      let user = await this.prisma.user.findUnique({
        where: { email: supabaseUser.email },
      });

      if (!user) {
        // Create new user from OAuth data
        user = await this.prisma.user.create({
          data: {
            email: supabaseUser.email,
            name: supabaseUser.user_metadata?.full_name || supabaseUser.email.split('@')[0],
            password: null, // OAuth users don't have password
            roles: ['owner'], // Default to owner role
            emailVerified: true, // OAuth emails are pre-verified
            providerStatus: 'NONE',
          },
        });

        this.logger.log(`Created new user from OAuth: ${user.email}`);
      } else {
        // Update email verification if needed
        if (!user.emailVerified) {
          user = await this.prisma.user.update({
            where: { id: user.id },
            data: { emailVerified: true },
          });
        }
      }

      // Issue OUR custom JWT token
      const token = this.jwtService.sign({
        sub: user.id,
        email: user.email,
        roles: user.roles,
      });

      this.logger.log(`Issued JWT for OAuth user: ${user.email}`);

      return {
        token,
        user: new UserEntity(user),
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`OAuth callback error: ${errorMessage}`, errorStack);
      throw new UnauthorizedException('OAuth authentication failed');
    }
  }
}
