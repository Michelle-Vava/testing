import { useRole } from '@/features/auth/hooks/useRole';
import { useProvidersControllerGetOnboardingStatus } from '@/services/generated/providers/providers';

/**
 * Provider onboarding state management
 * Centralizes onboarding flow logic
 */
export function useOnboardingState() {
  const { isProvider, needsOnboarding } = useRole();

  // Only fetch onboarding status if user is a provider
  const { data: onboardingStatus, isLoading } = useProvidersControllerGetOnboardingStatus({
    query: {
      enabled: isProvider,
    },
  });

  const isOnboarded = onboardingStatus?.isOnboarded ?? false;
  const requiresOnboarding = isProvider && !isOnboarded;

  return {
    isProvider,
    isOnboarded,
    requiresOnboarding,
    needsOnboarding,
    onboardingStatus,
    isLoading,
  };
}
