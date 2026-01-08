import { Injectable, UnauthorizedException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EmailService } from '../../shared/services/email.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';
import { VerifyEmailDto, ResendVerificationDto } from './dto/verify-email.dto';
import { UserEntity } from './entities/user.entity';
import { UserRole } from '../../shared/enums';

/**
 * AuthService handles all authentication and user management business logic
 * 
 * Provides secure user registration, login, password management, email verification,
 * and profile updates with proper hashing and token generation.
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {}

  /**
   * Register a new user with email verification
   * 
   * Creates user account with hashed password, generates verification token,
   * and sends verification email (TODO: implement email service).
   * 
   * @param signupDto - User registration data
   * @returns JWT token and sanitized user entity
   * @throws ConflictException if email is already registered
   */
  async signup(signupDto: SignupDto) {
    const { name, email, password, phone, roles } = signupDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine user roles - default to owner if not provided
    const userRoles = roles && roles.length > 0 ? roles : [UserRole.OWNER];

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenHash = await bcrypt.hash(verificationToken, 10);

    // Determine initial provider status
    const isProvider = userRoles.includes('provider');
    const providerStatus = isProvider ? 'NONE' : undefined;

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        phone,
        roles: userRoles,
        emailVerificationToken: verificationTokenHash,
        emailVerified: false,
        ...(isProvider && { providerStatus: 'NONE' as any }),
      },
    });

    // TODO: Send verification email
    this.logger.log(`Email verification requested for user: ${email}`);

    // Generate JWT tokens
    const { token, refreshToken } = this.generateTokens(user);

    return {
      token,
      refreshToken,
      user: new UserEntity(user),
    };
  }

  /**
   * Authenticate user with email and password
   * 
   * Validates credentials and generates JWT token for subsequent requests.
   * 
   * @param loginDto - Login credentials (email, password)
   * @returns JWT token and sanitized user entity
   * @throws UnauthorizedException if email doesn't exist or password is incorrect
   */
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    if (!user.password) {
      throw new UnauthorizedException('This account uses OAuth authentication. Please sign in with Google.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT tokens
    const { token, refreshToken } = this.generateTokens(user);

    return {
      token,
      refreshToken,
      user: new UserEntity(user),
    };
  }

  /**
   * Get user profile by ID
   * 
   * @param userId - User UUID from JWT token
   * @returns Sanitized user entity
   * @throws UnauthorizedException if user not found
   */

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

  /**
   * Update user profile with partial data
   * 
   * Updates user information including personal details and provider-specific fields.
   * Automatically marks provider onboarding as complete when all required fields are filled
   * (business name, service types, location).
   * 
   * @param userId - User UUID from JWT token
   * @param updateProfileDto - Partial profile data to update
   * @returns Updated sanitized user entity
   */
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return new UserEntity(user);
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const updateData: any = {};

    // Common fields
    if (updateProfileDto.name !== undefined) updateData.name = updateProfileDto.name;
    if (updateProfileDto.phoneNumber !== undefined) updateData.phone = updateProfileDto.phoneNumber;
    if (updateProfileDto.address !== undefined) updateData.address = updateProfileDto.address;
    if (updateProfileDto.city !== undefined) updateData.city = updateProfileDto.city;
    if (updateProfileDto.state !== undefined) updateData.state = updateProfileDto.state;
    if (updateProfileDto.zipCode !== undefined) updateData.zipCode = updateProfileDto.zipCode;
    if (updateProfileDto.avatarUrl !== undefined) updateData.avatarUrl = updateProfileDto.avatarUrl;
    if (updateProfileDto.bio !== undefined) updateData.bio = updateProfileDto.bio;
    
    // Provider-specific fields
    if (updateProfileDto.businessName !== undefined) updateData.businessName = updateProfileDto.businessName;
    if (updateProfileDto.serviceTypes !== undefined) updateData.serviceTypes = updateProfileDto.serviceTypes;
    if (updateProfileDto.yearsInBusiness !== undefined) updateData.yearsInBusiness = updateProfileDto.yearsInBusiness;
    if (updateProfileDto.shopAddress !== undefined) updateData.shopAddress = updateProfileDto.shopAddress;
    if (updateProfileDto.serviceArea !== undefined) updateData.serviceArea = updateProfileDto.serviceArea;
    if (updateProfileDto.isMobileService !== undefined) updateData.isMobileService = updateProfileDto.isMobileService;
    if (updateProfileDto.isShopService !== undefined) updateData.isShopService = updateProfileDto.isShopService;
    if (updateProfileDto.hourlyRate !== undefined) updateData.hourlyRate = updateProfileDto.hourlyRate;
    if (updateProfileDto.website !== undefined) updateData.website = updateProfileDto.website;
    if (updateProfileDto.certifications !== undefined) updateData.certifications = updateProfileDto.certifications;
    if (updateProfileDto.insuranceInfo !== undefined) updateData.insuranceInfo = updateProfileDto.insuranceInfo;
    
    // Onboarding completion
    if (updateProfileDto.onboardingComplete !== undefined) {
      updateData.onboardingComplete = updateProfileDto.onboardingComplete;
    }

    // Check provider onboarding status and update roles if necessary
    const currentUser = await this.prisma.user.findUnique({ where: { id: userId } });
    
    if (currentUser) {
      const mergedData = { ...currentUser, ...updateData };
      
      // Check if user is filling out provider info (Business Name or Services)
      const hasBusinessName = !!mergedData.businessName;
      const hasServiceTypes = mergedData.serviceTypes && mergedData.serviceTypes.length > 0;
      const hasLocation = !!(mergedData.city && mergedData.state);
      
      // If user is attempting to provide provider details
      if (hasBusinessName || hasServiceTypes) {
        // Automatically add PROVIDER role if missing
        if (!currentUser.roles.includes(UserRole.PROVIDER)) {
          updateData.roles = [...currentUser.roles, UserRole.PROVIDER];
        }

        // Mark onboarding as complete if all requirements met
        if (hasBusinessName && hasServiceTypes && hasLocation) {
          updateData.providerOnboardingComplete = true;
        }
      }
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return new UserEntity(user);
  }

  async validateUser(userId: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    return user ? new UserEntity(user) : null;
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    // Don't reveal if user exists or not (security best practice)
    if (!user) {
      return { message: 'If the email exists, a password reset link has been sent.' };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = await bcrypt.hash(resetToken, 10);
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
/**
   * Reset user password with reset token
   * 
   * Validates hashed reset token, checks expiration, and updates password.
   * Clears reset token after successful reset.
   * 
   * @param resetPasswordDto - Reset token and new password
   * @returns Success message
   * @throws BadRequestException if token is invalid or expired
   */
  
    // Save token to database
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: resetTokenHash,
        resetTokenExpiry,
      },
    });

    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:5173');
    const resetUrl = `${frontendUrl}/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    // Send email using EmailService
    this.emailService.sendPasswordResetEmail(email, resetUrl);
    
    // Log for dev convenience (can remove later if strict security is needed in logs)
    this.logger.log(`Password reset requested for ${email}`);

    return { message: 'If the email exists, a password reset link has been sent.' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, newPassword } = resetPasswordDto;

    // Find user by checking all reset tokens (not ideal, but works for MVP)
    const users = await this.prisma.user.findMany({
      where: {
        resetTokenExpiry: {
          gte: new Date(),
        },
      },
    });

    let userToReset = null;
    for (const user of users) {
      if (user.resetToken) {
        const isValidToken = await bcrypt.compare(token, user.resetToken);
        if (isValidToken) {
          userToReset = user;
          break;
        }
      }
    }

    if (!userToReset) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    await this.prisma.user.update({
      where: { id: userToReset.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return { message: 'Password reset successfully' };
  }

  /**
   * Verify user email address with verification token
   * @param verifyEmailDto - Email and verification token
   * @returns Success message
   * @throws BadRequestException if token is invalid or expired
   */
  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const { email, token } = verifyEmailDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.emailVerificationToken) {
      throw new BadRequestException('Invalid verification token');
    }

    // Verify token
    const isValidToken = await bcrypt.compare(token, user.emailVerificationToken);

    if (!isValidToken) {
      throw new BadRequestException('Invalid verification token');
    }

    // Mark email as verified and clear token
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
      },
    });

    return { message: 'Email verified successfully' };
  }

  /**
   * Resend email verification link to user
   * @param resendDto - Email address to resend verification to
   * @returns Success message (doesn't reveal if email exists)
   */
  async resendVerificationEmail(resendDto: ResendVerificationDto) {
    const { email } = resendDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    // Don't reveal if user exists (security best practice)
    if (!user) {
      return { message: 'If the email exists, a verification link has been sent.' };
    }

    // Don't resend if already verified
    if (user.emailVerified) {
      return { message: 'Email is already verified.' };
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenHash = await bcrypt.hash(verificationToken, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: verificationTokenHash,
      },
    });

    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:5173');
    const verifyUrl = `${frontendUrl}/auth/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;
    
    // Send verification email
    this.emailService.sendVerificationEmail(email, verifyUrl);

    this.logger.log(`Email verification resent for user: ${email}`);
    // console.log(`[DEV] Verify Link: ${verifyUrl}`);

    return { message: 'If the email exists, a verification link has been sent.' };
  }

  /**
   * Refresh access token using refresh token
   * 
   * @param refreshToken - Valid refresh token from cookie
   * @returns New access token, refresh token, and user data
   */
  async refreshToken(refreshToken: string) {
    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      // Get user
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Generate new tokens
      const tokens = this.generateTokens(user);

      return {
        ...tokens,
        user: new UserEntity(user),
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  /**
   * Generate access and refresh tokens for a user
   */
  private generateTokens(user: any): { token: string; refreshToken: string } {
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };

    // Access token - short lived (15 minutes)
    const token = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    // Refresh token - long lived (7 days)
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return { token, refreshToken };
  }
}
