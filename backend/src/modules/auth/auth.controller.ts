import { Controller, Post, Get, Put, Body, UseGuards, Request, Query, Res, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';
import { VerifyEmailDto, ResendVerificationDto } from './dto/verify-email.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
// import { SkipCsrf } from './decorators/skip-csrf.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { AuthenticatedRequest } from '../../shared/types/express-request.interface';

/**
 * AuthController handles all authentication-related endpoints
 * 
 * Provides user registration, login, profile management, password reset,
 * and email verification functionality with proper rate limiting.
 */
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Register a new user account
   * 
   * Creates a new user with hashed password and sends email verification.
   * Rate limited to prevent spam account creation.
   * 
   * @param signupDto - User registration data (name, email, password, phone, roles)
   * @returns JWT token and user profile data
   * @throws ConflictException if email already exists
   */
  @Post('signup')
  // @SkipCsrf()
  @Throttle({ default: { limit: 5, ttl: 900000 } }) // 5 attempts per 15 minutes
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiCreatedResponse({ type: AuthResponseDto })
  async signup(
    @Body() signupDto: SignupDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.signup(signupDto);
    
    // Set httpOnly cookies for security
    // In dev (localhost), we must check if we are truly on HTTPS to set Secure
    // Also, SameSite=Lax is best for localhost to localhost communication
    this.setAuthCookies(res, result.token, result.refreshToken);
    
    return { 
      user: result.user,
      accessToken: result.token,
    };
  }

  /**
   * Authenticate existing user
   * 
   * Validates credentials and returns JWT token for authenticated requests.
   * Rate limited to prevent brute force attacks.
   * 
   * @param loginDto - Login credentials (email, password)
   * @returns JWT token and user profile data
   * @throws UnauthorizedException if credentials are invalid
   */
  @Post('login')
  // @SkipCsrf()
  @Throttle({ default: { limit: 5, ttl: 900000 } }) // 5 attempts per 15 minutes
  @ApiOperation({ summary: 'Login user' })
  @ApiCreatedResponse({ type: AuthResponseDto })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(loginDto);
    
    // Set httpOnly cookies for security
    this.setAuthCookies(res, result.token, result.refreshToken);
    
    return { 
      user: result.user,
      accessToken: result.token,
    };
  }

  /**
   * Get authenticated user's profile
   * 
   * Returns current user data from JWT token. Requires authentication.
   * 
   * @param req - Authenticated request with user JWT payload
   * @returns User profile data
   * @throws UnauthorizedException if not authenticated
   */
  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getMe(@Request() req: AuthenticatedRequest) {
    return this.authService.getMe(req.user.sub);
  }

  /**
   * Update authenticated user's profile
   * 
   * Updates user information including address, bio, provider details, etc.
   * Auto-completes provider onboarding when all required fields are filled.
   * 
   * @param req - Authenticated request with user JWT payload
   * @param updateProfileDto - Profile fields to update
   * @returns Updated user profile data
   * @throws UnauthorizedException if not authenticated
   */
  @Put('profile')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Request() req: AuthenticatedRequest, @Body() updateProfileDto: UpdateProfileDto) {
    return this.authService.updateProfile(req.user.sub, updateProfileDto);
  }

  /**
   * Request password reset email
   * 
   * Generates secure reset token and sends email with reset link.
   * Doesn't reveal if email exists (security best practice).
   * 
   * @param forgotPasswordDto - Email address for password reset
   * @returns Generic success message
   */
  @Post('forgot-password')
  @Throttle({ default: { limit: 3, ttl: 900000 } }) // 3 attempts per 15 minutes
  @ApiOperation({ summary: 'Request password reset email' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  /**
   * Reset password using reset token
   * 
   * Validates reset token and updates user password.
   * Token expires after 1 hour.
   * 
   * @param resetPasswordDto - Reset token and new password
   * @returns Success message
   * @throws BadRequestException if token is invalid or expired
   */
  @Post('reset-password')
  @Throttle({ default: { limit: 5, ttl: 900000 } })
  @ApiOperation({ summary: 'Reset password with token' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  /**
   * Verify user email address with verification token
   * @param verifyEmailDto - Email and verification token
   * @returns Success message if verification successful
   */
  @Post('verify-email')
  @Throttle({ default: { limit: 5, ttl: 900000 } })
  @ApiOperation({ summary: 'Verify email address with token' })
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto);
  }

  /**
   * Resend verification email to user
   * @param resendDto - Email address to resend verification to
   * @returns Success message (doesn't reveal if email exists)
   */
  @Post('resend-verification')
  @Throttle({ default: { limit: 3, ttl: 900000 } })
  @ApiOperation({ summary: 'Resend email verification link' })
  async resendVerification(@Body() resendDto: ResendVerificationDto) {
    return this.authService.resendVerificationEmail(resendDto);
  }

  /**
   * Refresh access token using refresh token cookie
   */
  @Post('refresh')
  // @SkipCsrf() // Skip CSRF for refresh endpoint
  @ApiOperation({ summary: 'Refresh access token' })
  async refresh(
    @Request() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refresh_token;
    
    if (!refreshToken) {
      res.clearCookie('access_token');
      res.clearCookie('refresh_token');
      // Throw 403 Forbidden instead of 401 to distinguish from expired token
      throw new ForbiddenException('No refresh token provided');
    }
    
    const result = await this.authService.refreshToken(refreshToken);
    this.setAuthCookies(res, result.token, result.refreshToken);
    
    return { 
      user: result.user,
      accessToken: result.token,
    };
  }

  /**
   * Logout - clear auth cookies
   */
  @Post('logout')
  // @SkipCsrf() // Skip CSRF for logout
  @ApiOperation({ summary: 'Logout user' })
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/' });
    return { message: 'Logged out successfully' };
  }

  /**
   * Helper to set auth cookies with proper security settings
   */
  private setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    const isProduction = process.env.NODE_ENV === 'production';
    
    // Access token - short lived (15 minutes)
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: isProduction, // False in dev is CRITICAL for localhost http
      sameSite: isProduction ? 'strict' : 'lax', // Lax is better for dev
      path: '/',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    
    // Refresh token - long lived (7 days)
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }
}
