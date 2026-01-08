import { createFileRoute, redirect } from '@tanstack/react-router';
import { ProviderSetup } from '@/features/provider/components/ProviderSetup';
import { AuthService } from '@/features/auth/utils/auth-service';

export const Route = createFileRoute('/provider/onboarding')({
  beforeLoad: () => {
    // Require authentication
    const user = AuthService.requireAuth();
    
    // Check provider status
    const providerStatus = user.providerStatus || 'NONE';
    
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
