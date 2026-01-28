import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { User } from '@prisma/client';

/**
 * DTO for creating a user from external auth provider (Clerk, Auth0, etc.)
 * NOTE: Roles should NOT be passed from auth provider - they are managed in the database
 */
interface CreateUserFromAuthDto {
  externalAuthId: string;
  email: string;
  name: string;
  avatarUrl?: string;
  authProvider: string;
  phone?: string;
  // roles is optional and should not be used from external auth
  // Users will default to ['owner'] role
  roles?: string[];
}

interface UpdateUserFromAuthDto {
  email?: string;
  name?: string;
  avatarUrl?: string;
  phone?: string;
}

interface UpdateProfileDto {
  // User fields
  name?: string;
  phone?: string;
  avatarUrl?: string;
  // Owner profile fields
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  bio?: string;
  onboardingComplete?: boolean;
  // Provider profile fields
  businessName?: string;
  serviceTypes?: string[];
  yearsInBusiness?: number;
  shopAddress?: string;
  shopCity?: string;
  shopState?: string;
  shopZipCode?: string;
  serviceArea?: string[];
  isMobileService?: boolean;
  isShopService?: boolean;
  hourlyRate?: number;
  website?: string;
}

/**
 * ClerkAuthService - Handles user management with Clerk authentication
 * 
 * This service manages users in YOUR database, synced from Clerk via webhooks.
 * It's designed to be auth-provider agnostic - can be used with Auth0/Supabase too.
 */
@Injectable()
export class ClerkAuthService {
  private readonly logger = new Logger(ClerkAuthService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Find user by external auth provider ID (Clerk user_xxx, Auth0 auth0|xxx, etc.)
   */
  async findByExternalId(externalAuthId: string) {
    return this.prisma.user.findUnique({
      where: { externalAuthId },
      include: {
        ownerProfile: true,
        providerProfile: true,
      },
    });
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        ownerProfile: true,
        providerProfile: true,
      },
    });
  }

  /**
   * Find user by ID
   */
  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        ownerProfile: true,
        providerProfile: true,
      },
    });
  }

  /**
   * Create user from external auth provider (Clerk webhook or first login)
   * NOTE: All new users default to ['owner'] role
   * Roles can be updated later via /auth/update-roles endpoint
   */
  async createFromExternalAuth(data: CreateUserFromAuthDto) {
    this.logger.log(`Creating user from ${data.authProvider}: ${data.email}`);

    // Default to 'owner' role - roles should NOT come from external auth
    const roles = data.roles || ['owner'];
    const isProvider = roles.includes('provider');

    return this.prisma.user.create({
      data: {
        externalAuthId: data.externalAuthId,
        authProvider: data.authProvider,
        email: data.email,
        name: data.name,
        avatarUrl: data.avatarUrl,
        phone: data.phone,
        roles,
        providerProfile: isProvider
          ? {
              create: {
                isActive: false,
              },
            }
          : undefined,
      },
      include: {
        providerProfile: true,
      },
    });
  }

  /**
   * Update user from external auth provider (Clerk webhook)
   */
  async updateFromExternalAuth(externalAuthId: string, data: UpdateUserFromAuthDto) {
    this.logger.log(`Updating user: ${externalAuthId}`);

    return this.prisma.user.update({
      where: { externalAuthId },
      data: {
        email: data.email,
        name: data.name,
        avatarUrl: data.avatarUrl,
        phone: data.phone,
      },
      include: {
        ownerProfile: true,
        providerProfile: true,
      },
    });
  }

  /**
   * Soft delete user (Clerk webhook)
   */
  async deleteFromExternalAuth(externalAuthId: string) {
    this.logger.log(`Soft deleting user: ${externalAuthId}`);

    return this.prisma.user.update({
      where: { externalAuthId },
      data: { deletedAt: new Date() },
    });
  }

  /**
   * Update user profile (from your app)
   * Handles both User fields and OwnerProfile fields
   */
  async updateProfile(userId: string, data: UpdateProfileDto) {
    // Separate user fields and provider profile fields
    const userFields: Partial<User> = {};
    const providerProfileFields: Record<string, any> = {};

    // User-level fields (including address fields)
    if (data.name !== undefined) userFields.name = data.name;
    if (data.phone !== undefined) userFields.phone = data.phone;
    if (data.avatarUrl !== undefined) userFields.avatarUrl = data.avatarUrl;
    if (data.address !== undefined) userFields.address = data.address;
    if (data.city !== undefined) userFields.city = data.city;
    if (data.state !== undefined) userFields.state = data.state;
    if (data.zipCode !== undefined) userFields.zipCode = data.zipCode;

    // Provider profile fields
    if (data.businessName !== undefined) providerProfileFields.businessName = data.businessName;
    if (data.serviceTypes !== undefined) providerProfileFields.serviceTypes = data.serviceTypes;
    if (data.yearsInBusiness !== undefined) providerProfileFields.yearsInBusiness = data.yearsInBusiness;
    if (data.shopAddress !== undefined) providerProfileFields.shopAddress = data.shopAddress;
    if (data.shopCity !== undefined) providerProfileFields.shopCity = data.shopCity;
    if (data.shopState !== undefined) providerProfileFields.shopState = data.shopState;
    if (data.shopZipCode !== undefined) providerProfileFields.shopZipCode = data.shopZipCode;
    if (data.serviceArea !== undefined) providerProfileFields.serviceArea = data.serviceArea;
    if (data.hourlyRate !== undefined) providerProfileFields.hourlyRate = data.hourlyRate;
    if (data.website !== undefined) providerProfileFields.website = data.website;

    // Update user and profiles in a transaction
    return this.prisma.$transaction(async (tx) => {
      // Update user fields if any
      if (Object.keys(userFields).length > 0) {
        await tx.user.update({
          where: { id: userId },
          data: userFields,
        });
      }

      // Update provider profile fields if any
      if (Object.keys(providerProfileFields).length > 0) {
        await tx.providerProfile.upsert({
          where: { userId },
          update: providerProfileFields,
          create: {
            userId,
            isActive: false,
            ...providerProfileFields,
          },
        });
      }

      // Return updated user with profiles
      return tx.user.findUnique({
        where: { id: userId },
        include: {
          providerProfile: true,
        },
      });
    });
  }

  /**
   * Update user roles
   */
  async updateRoles(userId: string, roles: string[]) {
    const isProvider = roles.includes('provider');
    
    // Create provider profile if becoming a provider
    if (isProvider) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { providerProfile: true },
      });

      if (user && !user.providerProfile) {
        await this.prisma.providerProfile.create({
          data: {
            userId,
            isActive: false,
          },
        });
      }
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { roles },
      include: {
        providerProfile: true,
      },
    });
  }

  /**
   * Get current user (for /auth/me endpoint)
   */
  async getCurrentUser(userId: string) {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
