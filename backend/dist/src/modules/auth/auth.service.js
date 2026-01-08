"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const crypto = __importStar(require("crypto"));
const prisma_service_1 = require("../../infrastructure/database/prisma.service");
const email_service_1 = require("../../shared/services/email.service");
const user_entity_1 = require("./entities/user.entity");
const enums_1 = require("../../shared/enums");
let AuthService = AuthService_1 = class AuthService {
    prisma;
    jwtService;
    configService;
    emailService;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(prisma, jwtService, configService, emailService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
        this.emailService = emailService;
    }
    async signup(signupDto) {
        const { name, email, password, phone, roles } = signupDto;
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email already in use');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const userRoles = roles && roles.length > 0 ? roles : [enums_1.UserRole.OWNER];
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenHash = await bcrypt.hash(verificationToken, 10);
        const isProvider = userRoles.includes('provider');
        const providerStatus = isProvider ? 'NONE' : undefined;
        const user = await this.prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                phone,
                roles: userRoles,
                emailVerificationToken: verificationTokenHash,
                emailVerified: false,
                ...(isProvider && { providerStatus: 'NONE' }),
            },
        });
        this.logger.log(`Email verification requested for user: ${email}`);
        const { token, refreshToken } = this.generateTokens(user);
        return {
            token,
            refreshToken,
            user: new user_entity_1.UserEntity(user),
        };
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.password) {
            throw new common_1.UnauthorizedException('This account uses OAuth authentication. Please sign in with Google.');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const { token, refreshToken } = this.generateTokens(user);
        return {
            token,
            refreshToken,
            user: new user_entity_1.UserEntity(user),
        };
    }
    async getMe(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return new user_entity_1.UserEntity(user);
    }
    async updateProfile(userId, updateProfileDto) {
        const updateData = {};
        if (updateProfileDto.name !== undefined)
            updateData.name = updateProfileDto.name;
        if (updateProfileDto.phoneNumber !== undefined)
            updateData.phone = updateProfileDto.phoneNumber;
        if (updateProfileDto.address !== undefined)
            updateData.address = updateProfileDto.address;
        if (updateProfileDto.city !== undefined)
            updateData.city = updateProfileDto.city;
        if (updateProfileDto.state !== undefined)
            updateData.state = updateProfileDto.state;
        if (updateProfileDto.zipCode !== undefined)
            updateData.zipCode = updateProfileDto.zipCode;
        if (updateProfileDto.avatarUrl !== undefined)
            updateData.avatarUrl = updateProfileDto.avatarUrl;
        if (updateProfileDto.bio !== undefined)
            updateData.bio = updateProfileDto.bio;
        if (updateProfileDto.businessName !== undefined)
            updateData.businessName = updateProfileDto.businessName;
        if (updateProfileDto.serviceTypes !== undefined)
            updateData.serviceTypes = updateProfileDto.serviceTypes;
        if (updateProfileDto.yearsInBusiness !== undefined)
            updateData.yearsInBusiness = updateProfileDto.yearsInBusiness;
        if (updateProfileDto.shopAddress !== undefined)
            updateData.shopAddress = updateProfileDto.shopAddress;
        if (updateProfileDto.serviceArea !== undefined)
            updateData.serviceArea = updateProfileDto.serviceArea;
        if (updateProfileDto.isMobileService !== undefined)
            updateData.isMobileService = updateProfileDto.isMobileService;
        if (updateProfileDto.isShopService !== undefined)
            updateData.isShopService = updateProfileDto.isShopService;
        if (updateProfileDto.hourlyRate !== undefined)
            updateData.hourlyRate = updateProfileDto.hourlyRate;
        if (updateProfileDto.website !== undefined)
            updateData.website = updateProfileDto.website;
        if (updateProfileDto.certifications !== undefined)
            updateData.certifications = updateProfileDto.certifications;
        if (updateProfileDto.insuranceInfo !== undefined)
            updateData.insuranceInfo = updateProfileDto.insuranceInfo;
        if (updateProfileDto.onboardingComplete !== undefined) {
            updateData.onboardingComplete = updateProfileDto.onboardingComplete;
        }
        const currentUser = await this.prisma.user.findUnique({ where: { id: userId } });
        if (currentUser) {
            const mergedData = { ...currentUser, ...updateData };
            const hasBusinessName = !!mergedData.businessName;
            const hasServiceTypes = mergedData.serviceTypes && mergedData.serviceTypes.length > 0;
            const hasLocation = !!(mergedData.city && mergedData.state);
            if (hasBusinessName || hasServiceTypes) {
                if (!currentUser.roles.includes(enums_1.UserRole.PROVIDER)) {
                    updateData.roles = [...currentUser.roles, enums_1.UserRole.PROVIDER];
                }
                if (hasBusinessName && hasServiceTypes && hasLocation) {
                    updateData.providerOnboardingComplete = true;
                }
            }
        }
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: updateData,
        });
        return new user_entity_1.UserEntity(user);
    }
    async validateUser(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        return user ? new user_entity_1.UserEntity(user) : null;
    }
    async forgotPassword(forgotPasswordDto) {
        const { email } = forgotPasswordDto;
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return { message: 'If the email exists, a password reset link has been sent.' };
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = await bcrypt.hash(resetToken, 10);
        const resetTokenExpiry = new Date(Date.now() + 3600000);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken: resetTokenHash,
                resetTokenExpiry,
            },
        });
        const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:5173');
        const resetUrl = `${frontendUrl}/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
        this.emailService.sendPasswordResetEmail(email, resetUrl);
        this.logger.log(`Password reset requested for ${email}`);
        return { message: 'If the email exists, a password reset link has been sent.' };
    }
    async resetPassword(resetPasswordDto) {
        const { token, newPassword } = resetPasswordDto;
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
            throw new common_1.BadRequestException('Invalid or expired reset token');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
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
    async verifyEmail(verifyEmailDto) {
        const { email, token } = verifyEmailDto;
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user || !user.emailVerificationToken) {
            throw new common_1.BadRequestException('Invalid verification token');
        }
        const isValidToken = await bcrypt.compare(token, user.emailVerificationToken);
        if (!isValidToken) {
            throw new common_1.BadRequestException('Invalid verification token');
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: true,
                emailVerificationToken: null,
            },
        });
        return { message: 'Email verified successfully' };
    }
    async resendVerificationEmail(resendDto) {
        const { email } = resendDto;
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return { message: 'If the email exists, a verification link has been sent.' };
        }
        if (user.emailVerified) {
            return { message: 'Email is already verified.' };
        }
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenHash = await bcrypt.hash(verificationToken, 10);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerificationToken: verificationTokenHash,
            },
        });
        const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:5173');
        const verifyUrl = `${frontendUrl}/auth/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;
        this.emailService.sendVerificationEmail(email, verifyUrl);
        this.logger.log(`Email verification resent for user: ${email}`);
        return { message: 'If the email exists, a verification link has been sent.' };
    }
    async refreshToken(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get('JWT_SECRET'),
            });
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
            });
            if (!user) {
                throw new common_1.UnauthorizedException('User not found');
            }
            const tokens = this.generateTokens(user);
            return {
                ...tokens,
                user: new user_entity_1.UserEntity(user),
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
    }
    generateTokens(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            roles: user.roles,
        };
        const token = this.jwtService.sign(payload, {
            expiresIn: '15m',
        });
        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: '7d',
        });
        return { token, refreshToken };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map