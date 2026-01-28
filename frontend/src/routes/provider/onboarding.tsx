import { createFileRoute, redirect } from '@tanstack/react-router';
import { ProviderSetup } from '@/features/provider/components/ProviderSetup';
import { requireAuth } from '@/features/auth/utils/auth-utils';

export const Route = createFileRoute('/provider/onboarding')({
  beforeLoad: () => {
    const user = requireAuth();
    
    // If already active, redirect to dashboard
    const providerIsActive = (user as any).providerIsActive;
    if (providerIsActive) {
      throw redirect({ to: '/provider/dashboard' });
    }
    
    return { user };
  },
  component: ProviderOnboardingPage,
});

function ProviderOnboardingPage() {
  return <ProviderSetup />;
}
