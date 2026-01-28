import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';

/**
 * Simplified service for managing provider onboarding and activation
 */
@Injectable()
export class ProviderStatusService {
  private readonly logger = new Logger(ProviderStatusService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Start provider onboarding - creates/updates provider profile
   */
  async startOnboarding(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { providerProfile: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Add provider role if not present
    const hasProviderRole = user.roles.includes('provider');
    
    if (!hasProviderRole) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { roles: { push: 'provider' } },
      });
    }

    // Create provider profile if doesn't exist
    if (!user.providerProfile) {
      const profile = await this.prisma.providerProfile.create({
        data: {
          userId,
          isActive: false,
        },
      });
      
      this.logger.log(`Provider onboarding started for user ${userId}`);
      return { message: 'Provider onboarding started', profile };
    }

    return { message: 'Provider profile already exists', profile: user.providerProfile };
  }

  /**
   * Complete provider onboarding and activate provider
   */
  async completeOnboarding(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        providerProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const pp = user.providerProfile;

    // Validate required fields
    const isValid = this.validateOnboardingComplete(pp, user, user.phone);

    if (!isValid) {
      throw new BadRequestException(
        'Provider profile incomplete. Please fill all required fields.',
      );
    }

    // Mark as active (onboardingComplete field removed)
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        providerProfile: {
          update: {
            isActive: true, // Auto-activate after completing onboarding
          },
        },
      },
      include: { providerProfile: true },
    });

    this.logger.log(`Provider ${userId} onboarding completed and activated`);

    return {
      message: 'Provider onboarding complete! You can now submit quotes.',
      profile: updated.providerProfile,
    };
  }

  /**
   * Get provider onboarding status and checklist
   */
  async getOnboardingStatus(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        providerProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const pp = user.providerProfile;

    // Build onboarding checklist
    const checklist = [
      {
        id: 'business_name',
        label: 'Business Name',
        completed: !!pp?.businessName,
      },
      {
        id: 'service_types',
        label: 'Service Types',
        completed: (pp?.serviceTypes?.length || 0) > 0,
      },
      {
        id: 'location',
        label: 'Shop Location',
        completed: !!(pp?.shopAddress && pp?.shopCity && pp?.shopState && pp?.shopZipCode),
      },
      {
        id: 'contact',
        label: 'Contact Info',
        completed: !!(user.phone && user.email),
      },
      {
        id: 'personal_info',
        label: 'Personal Info',
        completed: !!(user.address && user.city && user.state && user.zipCode),
      },
    ];

    const completedCount = checklist.filter((item) => item.completed).length;
    const totalCount = checklist.length;
    const isComplete = completedCount === totalCount;

    return {
      isActive: pp?.isActive || false,
      checklist,
      progress: {
        completed: completedCount,
        total: totalCount,
        percentage: Math.round((completedCount / totalCount) * 100),
      },
      canActivate: isComplete,
    };
  }

  /**
   * Validate if onboarding is complete
   */
  private validateOnboardingComplete(
    pp: any,
    user: any,
    phone?: string | null,
  ): boolean {
    if (!pp) return false;

    // Required provider fields
    const hasBusinessInfo = pp.businessName && pp.serviceTypes?.length > 0;
    const hasLocation = pp.shopAddress && pp.shopCity && pp.shopState && pp.shopZipCode;
    const hasContact = phone;

    // Required personal fields (from user model)
    const hasPersonalInfo = user?.address && user?.city && user?.state && user?.zipCode;

    return !!(hasBusinessInfo && hasLocation && hasContact && hasPersonalInfo);
  }

  /**
   * Deactivate a provider (admin function or suspension)
   */
  async deactivateProvider(userId: string, reason?: string) {
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        providerProfile: {
          update: {
            isActive: false,
          },
        },
      },
      include: { providerProfile: true },
    });

    this.logger.warn(`Provider ${userId} deactivated. Reason: ${reason || 'Not specified'}`);

    return {
      message: 'Provider deactivated',
      profile: updated.providerProfile,
    };
  }
}
