import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';
import { AuthenticatedRequest } from '../../shared/types/express-request.interface';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signup(signupDto: SignupDto): Promise<{
        token: string;
        user: import("./entities/user.entity").UserEntity;
    }>;
    login(loginDto: LoginDto): Promise<{
        token: string;
        user: import("./entities/user.entity").UserEntity;
    }>;
    getMe(req: AuthenticatedRequest): Promise<import("./entities/user.entity").UserEntity>;
    updateProfile(req: AuthenticatedRequest, updateProfileDto: UpdateProfileDto): Promise<import("./entities/user.entity").UserEntity>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
