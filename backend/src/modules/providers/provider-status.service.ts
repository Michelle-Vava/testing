import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { ProviderStatus } from '@prisma/client';

/**
 * Service for managing provider status transitions and onboarding
 */
@Injectable()
export class ProviderStatusService {
  private readonly logger = new Logger(ProviderStatusService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Update provider status with validation
   */
  async updateStatus(
    userId: string,
    newStatus: ProviderStatus,
    reason?: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        providerStatus: true,
        roles: true,
        businessName: true,
        serviceTypes: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.roles.includes('provider')) {
      throw new BadRequestException('User is not a provider');
    }

    // Validate status transitions
    this.validateStatusTransition(user.providerStatus, newStatus, user);

    // Update status
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        providerStatus: newStatus,
        providerStatusReason: reason,
        providerStatusChangedAt: new Date(),
        // Update legacy field for backwards compatibility
        providerOnboardingComplete: newStatus === ProviderStatus.ACTIVE,
      },
      select: {
        id: true,
        providerStatus: true,
        providerStatusReason: true,
        providerStatusChangedAt: true,
      },
    });

    this.logger.log(
      `Provider ${userId} status changed: ${user.providerStatus} → ${newStatus}`,
    );

    return updated;
  }

  /**
   * Complete provider onboarding and transition to appropriate status
   */
  async completeOnboarding(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        providerStatus: true,
        businessName: true,
        serviceTypes: true,
        shopAddress: true,
        shopCity: true,
        shopState: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validate required fields
    const isComplete = this.validateOnboardingComplete(user);

    if (!isComplete) {
      throw new BadRequestException(
        'Provider profile incomplete. Please fill all required fields.',
      );
    }

    // Transition from DRAFT or NONE to LIMITED
    // (admin must manually approve to ACTIVE)
    const newStatus =
      user.providerStatus === ProviderStatus.NONE ||
      user.providerStatus === ProviderStatus.DRAFT
        ? ProviderStatus.LIMITED
        : user.providerStatus;

    return this.updateStatus(userId, newStatus, 'Onboarding completed');
  }

  /**
   * Get onboarding status and completion checklist
   */
  async getOnboardingStatus(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        providerStatus: true,
        businessName: true,
        serviceTypes: true,
        bio: true,
        phone: true,
        shopAddress: true,
        shopCity: true,
        shopState: true,
        shopZipCode: true,
        certifications: true,
        yearsInBusiness: true,
        isMobileService: true,
        isShopService: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const checklist = {
      basicInfo: !!(user.businessName && user.bio && user.phone),
      serviceTypes: user.serviceTypes && user.serviceTypes.length > 0,
      location: !!(user.shopCity && user.shopState),
      serviceMethod: user.isMobileService || user.isShopService,
      experience: user.yearsInBusiness !== null && user.yearsInBusiness !== undefined,
    };

    const completionPercent =
      (Object.values(checklist).filter(Boolean).length /
        Object.values(checklist).length) *
      100;

    return {
      status: user.providerStatus,
      completionPercent: Math.round(completionPercent),
      checklist,
      canSubmit: Object.values(checklist).every(Boolean),
    };
  }

  /**
   * Validate status transitions
   */
  private validateStatusTransition(
    currentStatus: ProviderStatus,
    newStatus: ProviderStatus,
    user: any,
  ) {
    // NONE → DRAFT (start onboarding)
    if (
      currentStatus === ProviderStatus.NONE &&
      newStatus === ProviderStatus.DRAFT
    ) {
      return; // Always allowed
    }

    // DRAFT → LIMITED (complete onboarding)
    if (
      currentStatus === ProviderStatus.DRAFT &&
      newStatus === ProviderStatus.LIMITED
    ) {
      if (!this.validateOnboardingComplete(user)) {
        throw new BadRequestException('Onboarding not complete');
      }
      return;
    }

    // LIMITED → ACTIVE (admin approval)
    if (
      currentStatus === ProviderStatus.LIMITED &&
      newStatus === ProviderStatus.ACTIVE
    ) {
      return; // Requires admin approval (checked in controller)
    }

    // ACTIVE → SUSPENDED (admin action)
    if (
      currentStatus === ProviderStatus.ACTIVE &&
      newStatus === ProviderStatus.SUSPENDED
    ) {
      return; // Requires admin approval (checked in controller)
    }

    // SUSPENDED → ACTIVE (admin reinstatement)
    if (
      currentStatus === ProviderStatus.SUSPENDED &&
      newStatus === ProviderStatus.ACTIVE
    ) {
      return; // Requires admin approval (checked in controller)
    }

    throw new BadRequestException(
      `Invalid status transition: ${currentStatus} → ${newStatus}`,
    );
  }

  /**
   * Validate onboarding completion
   */
  private validateOnboardingComplete(user: any): boolean {
    return !!(
      user.businessName &&
      user.serviceTypes &&
      user.serviceTypes.length > 0 &&
      user.shopCity &&
      user.shopState &&
      (user.isMobileService || user.isShopService)
    );
  }
}
