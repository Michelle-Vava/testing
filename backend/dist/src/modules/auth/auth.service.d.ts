import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';
import { UserEntity } from './entities/user.entity';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    signup(signupDto: SignupDto): Promise<{
        token: string;
        user: UserEntity;
    }>;
    login(loginDto: LoginDto): Promise<{
        token: string;
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
}
