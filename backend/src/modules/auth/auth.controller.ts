import { Controller, Post, Get, Put, Body, UseGuards, Request, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';
import { VerifyEmailDto, ResendVerificationDto } from './dto/verify-email.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
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
  @Throttle({ default: { limit: 5, ttl: 900000 } }) // 5 attempts per 15 minutes
  @ApiOperation({ summary: 'Sign up a new user' })
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
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
  @Throttle({ default: { limit: 5, ttl: 900000 } }) // 5 attempts per 15 minutes
  @ApiOperation({ summary: 'Login user' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
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
}
