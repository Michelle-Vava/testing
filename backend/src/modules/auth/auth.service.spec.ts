import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UserRole } from '../../shared/enums';

// Mock bcrypt module
jest.mock('bcrypt');
import * as bcrypt from 'bcrypt';

/**
 * AuthService Unit Tests
 * 
 * Tests all authentication and user management functionality including:
 * - User registration with email verification
 * - Login with password validation
 * - Password reset flow
 * - Email verification
 * - Profile updates
 * 
 * Coverage target: 80%+
 */
describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('test-value'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    const signupDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'SecurePass123!',
      phone: '1234567890',
      roles: [UserRole.OWNER],
    };

    it('should create a new user with hashed password and verification token', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      const createdUser = {
        id: 'user-id',
        email: signupDto.email,
        name: signupDto.name,
        phone: signupDto.phone,
        roles: [UserRole.OWNER],
        emailVerified: false,
        emailVerificationToken: 'hashed-token',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrismaService.user.create.mockResolvedValue(createdUser);

      const result = await service.signup(signupDto);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: signupDto.email },
      });
      expect(mockPrismaService.user.create).toHaveBeenCalled();
      expect(result).toHaveProperty('token', 'mock-jwt-token');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe(signupDto.email);
      // UserEntity excludes password, so it won't have it
    });

    it('should throw ConflictException if email already exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'existing-user',
        email: signupDto.email,
      });

      await expect(service.signup(signupDto)).rejects.toThrow(ConflictException);
      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
    });

    it('should default to OWNER role if no roles provided', async () => {
      const dtoWithoutRoles = { ...signupDto, roles: [] };
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        id: 'user-id',
        email: dtoWithoutRoles.email,
        roles: [UserRole.OWNER],
        emailVerified: false,
      });

      await service.signup(dtoWithoutRoles);

      const createCall = mockPrismaService.user.create.mock.calls[0][0];
      expect(createCall.data.roles).toEqual([UserRole.OWNER]);
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'john@example.com',
      password: 'SecurePass123!',
    };

    const mockUser = {
      id: 'user-id',
      email: loginDto.email,
      name: 'John Doe',
      password: 'hashed-password',
      roles: [UserRole.OWNER],
    };

    it('should return token and user on successful login', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login(loginDto);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
        roles: mockUser.roles,
      });
      expect(result).toHaveProperty('token', 'mock-jwt-token');
      expect(result.user.email).toBe(mockUser.email);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('forgotPassword', () => {
    const forgotPasswordDto = { email: 'john@example.com' };

    it('should generate reset token and return generic message', async () => {
      const mockUser = {
        id: 'user-id',
        email: forgotPasswordDto.email,
      };
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.update.mockResolvedValue(mockUser);

      const result = await service.forgotPassword(forgotPasswordDto);

      expect(mockPrismaService.user.update).toHaveBeenCalled();
      expect(result.message).toBe('If the email exists, a password reset link has been sent.');
    });

    it('should return generic message even if user not found (security)', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.forgotPassword(forgotPasswordDto);

      expect(mockPrismaService.user.update).not.toHaveBeenCalled();
      expect(result.message).toBe('If the email exists, a password reset link has been sent.');
    });
  });

  describe('resetPassword', () => {
    const resetPasswordDto = {
      token: 'reset-token',
      newPassword: 'NewSecurePass123!',
    };

    it('should reset password with valid token', async () => {
      const mockUser = {
        id: 'user-id',
        email: 'john@example.com',
        resetToken: 'hashed-reset-token',
        resetTokenExpiry: new Date(Date.now() + 3600000),
      };

      mockPrismaService.user.findMany.mockResolvedValue([mockUser]);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockPrismaService.user.update.mockResolvedValue(mockUser);

      const result = await service.resetPassword(resetPasswordDto);

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: expect.objectContaining({
          resetToken: null,
          resetTokenExpiry: null,
        }),
      });
      expect(result.message).toBe('Password reset successfully');
    });

    it('should throw BadRequestException if token is invalid', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([]);

      await expect(service.resetPassword(resetPasswordDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('verifyEmail', () => {
    const verifyEmailDto = {
      email: 'john@example.com',
      token: 'verification-token',
    };

    it('should verify email with valid token', async () => {
      const mockUser = {
        id: 'user-id',
        email: verifyEmailDto.email,
        emailVerificationToken: 'hashed-token',
        emailVerified: false,
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockPrismaService.user.update.mockResolvedValue({ ...mockUser, emailVerified: true });

      const result = await service.verifyEmail(verifyEmailDto);

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: {
          emailVerified: true,
          emailVerificationToken: null,
        },
      });
      expect(result.message).toBe('Email verified successfully');
    });

    it('should throw BadRequestException if token is invalid', async () => {
      const mockUser = {
        id: 'user-id',
        email: verifyEmailDto.email,
        emailVerificationToken: 'hashed-token',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.verifyEmail(verifyEmailDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateProfile', () => {
    const userId = 'user-id';
    const updateProfileDto = {
      name: 'Jane Doe',
      bio: 'Test bio',
      city: 'New York',
    };

    it('should update user profile', async () => {
      const mockUser = {
        id: userId,
        email: 'john@example.com',
        roles: [UserRole.OWNER],
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      const updatedUser = {
        ...mockUser,
        ...updateProfileDto,
      };
      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.updateProfile(userId, updateProfileDto);

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: expect.objectContaining({
          name: updateProfileDto.name,
          bio: updateProfileDto.bio,
          city: updateProfileDto.city,
        }),
      });
      expect(result.name).toBe(updateProfileDto.name);
    });

    it('should auto-complete provider onboarding when all fields are filled', async () => {
      const providerUpdate = {
        businessName: 'Test Shop',
        serviceTypes: ['Oil Change', 'Brake Service'],
        city: 'New York',
        state: 'NY',
      };

      const mockProvider = {
        id: userId,
        email: 'provider@example.com',
        roles: [UserRole.PROVIDER],
        providerOnboardingComplete: false,
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockProvider);
      mockPrismaService.user.update.mockResolvedValue({
        ...mockProvider,
        ...providerUpdate,
        providerOnboardingComplete: true,
      });

      await service.updateProfile(userId, providerUpdate);

      const updateCall = mockPrismaService.user.update.mock.calls[0][0];
      expect(updateCall.data.providerOnboardingComplete).toBe(true);
    });
  });

  describe('getMe', () => {
    it('should return user profile by ID', async () => {
      const mockUser = {
        id: 'user-id',
        email: 'john@example.com',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.getMe(mockUser.id);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
      expect(result.email).toBe(mockUser.email);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.getMe('non-existent-id')).rejects.toThrow(UnauthorizedException);
    });
  });
});
