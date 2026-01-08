import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ProviderStatus } from '@prisma/client';

export const PROVIDER_STATUSES_KEY = 'providerStatuses';
export const RequireProviderStatus = (...statuses: ProviderStatus[]) =>
  SetMetadata(PROVIDER_STATUSES_KEY, statuses);

/**
 * Guard that enforces provider status requirements
 * 
 * Usage:
 * @RequireProviderStatus(ProviderStatus.ACTIVE)
 * @Post('quotes')
 * async submitQuote() { ... }
 * 
 * @RequireProviderStatus(ProviderStatus.DRAFT, ProviderStatus.ACTIVE)
 * @Get('onboarding/status')
 * async getOnboardingStatus() { ... }
 */
@Injectable()
export class ProviderStatusGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredStatuses = this.reflector.getAllAndOverride<ProviderStatus[]>(
      PROVIDER_STATUSES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredStatuses || requiredStatuses.length === 0) {
      return true; // No status requirement
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const userStatus = user.providerStatus as ProviderStatus;

    if (!requiredStatuses.includes(userStatus)) {
      const statusReason = user.providerStatusReason;
      const message = this.getStatusMessage(userStatus, statusReason);
      
      throw new ForbiddenException({
        message,
        currentStatus: userStatus,
        requiredStatuses,
        statusReason,
      });
    }

    return true;
  }

  private getStatusMessage(status: ProviderStatus, reason?: string): string {
    switch (status) {
      case ProviderStatus.NONE:
        return 'Please complete provider onboarding first';
      case ProviderStatus.DRAFT:
        return 'Please complete your provider profile to access this feature';
      case ProviderStatus.LIMITED:
        return 'Your account has limited access. Please complete verification';
      case ProviderStatus.SUSPENDED:
        return reason || 'Your provider account has been suspended';
      case ProviderStatus.ACTIVE:
        return 'Access granted';
      default:
        return 'Invalid provider status';
    }
  }
}
