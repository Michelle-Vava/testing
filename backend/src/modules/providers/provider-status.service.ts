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
      include: {
        providerProfile: true,
        ownerProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.roles.includes('provider')) {
      throw new BadRequestException('User is not a provider');
    }

    const providerProfile = user.providerProfile;
    if (!providerProfile) {
       // Create if missing, but typically it should exist if they are provider role
       // Assume handled
    }
    const currentStatus = providerProfile?.status || ProviderStatus.NONE;

    // Validate status transitions
    this.validateStatusTransition(currentStatus, newStatus, providerProfile, user.ownerProfile, user.phone);

    // Update status
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        providerProfile: {
          update: {
            status: newStatus,
            statusReason: reason,
            statusChangedAt: new Date(),
          }
        }
      },
      include: { providerProfile: true }
    });

    this.logger.log(
      `Provider ${userId} status changed: ${currentStatus} → ${newStatus}`,
    );

    return updatedUser.providerProfile;
  }

  /**
   * Complete provider onboarding and transition to appropriate status
   */
  async completeOnboarding(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        providerProfile: true,
        ownerProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const pp = user.providerProfile;
    const op = user.ownerProfile;

    // Validate required fields
    const isComplete = this.validateOnboardingComplete(pp, op, user.phone);

    if (!isComplete) {
      throw new BadRequestException(
        'Provider profile incomplete. Please fill all required fields.',
      );
    }

    // Transition from DRAFT or NONE to LIMITED
    // (admin must manually approve to ACTIVE)
    const currentStatus = pp?.status || ProviderStatus.NONE;
    const newStatus =
      currentStatus === ProviderStatus.NONE ||
      currentStatus === ProviderStatus.DRAFT
        ? ProviderStatus.LIMITED
        : currentStatus;

    return this.updateStatus(userId, newStatus, 'Onboarding completed');
  }

  /**
   * Get onboarding status and completion checklist
   */
  async getOnboardingStatus(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        providerProfile: true,
        ownerProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const pp = user.providerProfile || {} as any;
    const op = user.ownerProfile || {} as any;

    const checklist = {
      basicInfo: !!(pp.businessName && op.bio && user.phone),
      serviceTypes: pp.serviceTypes && pp.serviceTypes.length > 0,
      location: !!(pp.shopCity && pp.shopState),
      serviceMethod: pp.isMobileService || pp.isShopService,
      experience: pp.yearsInBusiness !== null && pp.yearsInBusiness !== undefined,
    };

    const completionPercent =
      (Object.values(checklist).filter(Boolean).length /
        Object.values(checklist).length) *
      100;

    return {
      status: pp.status || ProviderStatus.NONE,
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
    providerProfile: any,
    ownerProfile: any,
    phone: string | null,
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
      if (!this.validateOnboardingComplete(providerProfile, ownerProfile, phone)) {
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
  private validateOnboardingComplete(providerProfile: any, ownerProfile: any, phone: string | null): boolean {
    if (!providerProfile) return false;
    return !!(
      providerProfile.businessName &&
      providerProfile.serviceTypes &&
      providerProfile.serviceTypes.length > 0 &&
      providerProfile.shopCity &&
      providerProfile.shopState &&
      (providerProfile.isMobileService || providerProfile.isShopService)
    );
  }
}
