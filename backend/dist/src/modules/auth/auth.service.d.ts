import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EmailService } from '../../shared/services/email.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';
import { VerifyEmailDto, ResendVerificationDto } from './dto/verify-email.dto';
import { UserEntity } from './entities/user.entity';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    private emailService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService, emailService: EmailService);
    signup(signupDto: SignupDto): Promise<{
        token: string;
        refreshToken: string;
        user: UserEntity;
    }>;
    login(loginDto: LoginDto): Promise<{
        token: string;
        refreshToken: string;
        user: UserEntity;
    }>;
    getMe(userId: string): Promise<UserEntity>;
    updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<UserEntity>;
    validateUser(userId: string): Promise<UserEntity | null>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<{
        message: string;
    }>;
    resendVerificationEmail(resendDto: ResendVerificationDto): Promise<{
        message: string;
    }>;
    refreshToken(refreshToken: string): Promise<{
        user: UserEntity;
        token: string;
        refreshToken: string;
    }>;
    private generateTokens;
}
