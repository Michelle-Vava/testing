import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { authGateStore } from '@/features/auth/stores/auth-gate-store';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/features/marketing/components/HeroSection';
import { HowItWorksSection } from '@/features/marketing/components/HowItWorksSection';
import { TopProvidersSection } from '@/features/marketing/components/TopProvidersSection';
import { CTASection } from '@/features/marketing/components/CTASection';
import { useLandingData } from '../hooks/use-landing-data';
import { UserRoles } from '@/lib/constants';
import { ROUTES } from '@/lib/routes';
import { useToast } from '@/components/ui/ToastContext';
import { hasRole } from '@/features/auth/utils/auth-utils';

export function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { providers, providersLoading } = useLandingData();
  const { error } = useToast();

  const handleRequestQuote = () => {
    if (!user) {
      authGateStore.open({ action: 'request a quote' });
    } else if (hasRole(user, 'owner')) {
      navigate({ to: ROUTES.OWNER_REQUESTS_NEW, search: { serviceType: undefined, providerId: undefined } });
    } else {
      error('Providers cannot request quotes. Switch to owner role to request services.');
    }
  };

  return (
    <div className="min-h-screen">
      <HeroSection />
      <HowItWorksSection />
      
      <TopProvidersSection
        providers={providers}
        handleRequestQuote={handleRequestQuote}
        loading={providersLoading}
      />

      <CTASection />
      <Footer />
    </div>
  );
}
