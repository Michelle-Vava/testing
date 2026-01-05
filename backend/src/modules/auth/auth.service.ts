import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
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
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
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
      },
    });

    // TODO: Send verification email
    console.log(`Email verification token for ${email}: ${verificationToken}`);
    console.log(`Verification link: http://localhost:5173/auth/verify-email?token=${verificationToken}&email=${email}`);

    // Generate JWT token
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      roles: user.roles,
    });

    return {
      token,
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
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
  /**
   * Get user profile by ID
   * 
   * @param userId - User UUID from JWT token
   * @returns Sanitized user entity
   * @throws UnauthorizedException if user not found
   */
      roles: user.roles,
    });

    return {
      token,
      user: new UserEntity(user),
    };
  }

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
    
    // Onboarding completion
    if (updateProfileDto.onboardingComplete !== undefined) {
      updateData.onboardingComplete = updateProfileDto.onboardingComplete;
    }

    // Check provider onboarding status
    const currentUser = await this.prisma.user.findUnique({ where: { id: userId } });
    if (currentUser && currentUser.roles.includes(UserRole.PROVIDER)) {
      const mergedData = { ...currentUser, ...updateData };
      
  /**
   * Validate user exists and return entity
   * 
   * Used by guards and middleware for authentication validation.
   * 
   * @param userId - User UUID to validate
   * @returns Sanitized user entity or null if not found
   */
      // Define what constitutes a "complete" provider profile
      const hasBusinessName = !!mergedData.businessName;
      const hasServiceTypes = mergedData.serviceTypes && mergedData.serviceTypes.length > 0;
      const hasLocation = !!(mergedData.city && mergedData.state); // Basic location check
      
      if (hasBusinessName && hasServiceTypes && hasLocation) {
        updateData.providerOnboardingComplete = true;
  /**
   * Initiate password reset flow
   * 
   * Generates secure reset token (hashed in database), sets 1-hour expiration,
   * and sends reset email (TODO: implement email service).
   * Doesn't reveal if email exists to prevent enumeration attacks.
   * 
   * @param forgotPasswordDto - Email address for password reset
   * @returns Generic success message (doesn't reveal if email exists)
   */
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

    // TODO: Send email with reset link
    // For now, log the token (in production, send via email service)
    console.log(`Password reset token for ${email}: ${resetToken}`);
    console.log(`Reset link: http://localhost:5173/auth/reset-password?token=${resetToken}&email=${email}`);

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

    // TODO: Send verification email
    console.log(`Email verification token for ${email}: ${verificationToken}`);
    console.log(`Verification link: http://localhost:5173/auth/verify-email?token=${verificationToken}&email=${email}`);

    return { message: 'If the email exists, a verification link has been sent.' };
  }
}
