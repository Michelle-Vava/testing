import { Response } from 'express';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';
import { VerifyEmailDto, ResendVerificationDto } from './dto/verify-email.dto';
import { AuthenticatedRequest } from '../../shared/types/express-request.interface';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signup(signupDto: SignupDto, res: Response): Promise<{
        user: import("./entities/user.entity").UserEntity;
        accessToken: string;
    }>;
    login(loginDto: LoginDto, res: Response): Promise<{
        user: import("./entities/user.entity").UserEntity;
        accessToken: string;
    }>;
    getMe(req: AuthenticatedRequest): Promise<import("./entities/user.entity").UserEntity>;
    updateProfile(req: AuthenticatedRequest, updateProfileDto: UpdateProfileDto): Promise<import("./entities/user.entity").UserEntity>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<{
        message: string;
    }>;
    resendVerification(resendDto: ResendVerificationDto): Promise<{
        message: string;
    }>;
    refresh(req: any, res: Response): Promise<{
        user: import("./entities/user.entity").UserEntity;
        accessToken: string;
    }>;
    logout(res: Response): Promise<{
        message: string;
    }>;
    private setAuthCookies;
}
