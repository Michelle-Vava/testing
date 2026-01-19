import { createFileRoute, redirect } from '@tanstack/react-router';
import { ProviderSetup } from '@/features/provider/components/ProviderSetup';
import { requireAuth } from '@/features/auth/utils/auth-utils';

export const Route = createFileRoute('/provider/onboarding')({
  beforeLoad: () => {
    // Require authentication
    const user = requireAuth();
    
    // Check provider status
    const providerStatus = user.providerStatus || 'NONE';
    
    // Safety check: if they have the completion flag or valid status, kick them out of onboarding
    if (user.providerOnboardingComplete || providerStatus === 'PENDING' || providerStatus === 'ACTIVE') {
       throw redirect({ to: '/provider/dashboard' });
    }
    
    // If status indicates onboarding is done or pending review, go to dashboard/status page
    // We only want to be here if status is NONE or DRAFT
    if (providerStatus !== 'NONE' && providerStatus !== 'DRAFT') {
       throw redirect({ to: '/provider/dashboard' });
    }
    
    return { user };
  },
  component: ProviderOnboardingPage,
});

function ProviderOnboardingPage() {
  return <ProviderSetup />;
}
