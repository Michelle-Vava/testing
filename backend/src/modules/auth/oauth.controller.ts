import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SupabaseOAuthService } from './supabase-oauth.service';

/**
 * OAuth Controller - Handles Google OAuth via Supabase
 * 
 * Flow:
 * 1. Frontend initiates Google OAuth with Supabase
 * 2. Supabase redirects back with code/token
 * 3. Frontend calls /oauth/callback with Supabase token
 * 4. Backend validates Supabase token, creates/finds user, issues OUR JWT
 * 5. Frontend uses OUR JWT for all subsequent requests
 */
@ApiTags('oauth')
@Controller('oauth')
export class OAuthController {
  constructor(private supabaseOAuthService: SupabaseOAuthService) {}

  /**
   * Handle OAuth callback - exchange Supabase token for our JWT
   * 
   * @param supabaseToken - Token from Supabase OAuth flow
   * @returns Our custom JWT token and user data
   */
  @Post('callback')
  @ApiOperation({ 
    summary: 'Exchange Supabase OAuth token for application JWT',
    description: 'Validates Supabase token, creates/finds user, issues custom JWT'
  })
  async handleCallback(@Body() body: { supabaseToken: string }) {
    return this.supabaseOAuthService.handleOAuthCallback(body.supabaseToken);
  }
}
