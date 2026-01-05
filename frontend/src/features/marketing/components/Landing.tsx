import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { authGateStore } from '@/features/auth/stores/auth-gate-store';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/routes/-components/HeroSection';
import { HowItWorksSection } from '@/routes/-components/HowItWorksSection';
import { MechanicSection } from '@/routes/-components/MechanicSection';
import { TopProvidersSection } from '@/routes/-components/TopProvidersSection';
import { RecentRequestsSection } from '@/routes/-components/RecentRequestsSection';
import { CTASection } from '@/routes/-components/CTASection';
import { useLandingData, getUrgencyColor } from '../hooks/use-landing-data';

export function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { providers, providersLoading, requests, requestsLoading, requestsError } = useLandingData();

  const handleRequestQuote = () => {
    if (!user) {
      authGateStore.open({ action: 'request a quote' });
    } else if (user.role === 'owner') {
      navigate({ to: '/owner/requests/new', search: { serviceType: undefined, providerId: undefined } });
    } else {
      alert('Providers cannot request quotes. Switch to owner role to request services.');
    }
  };

  return (
    <div className="min-h-screen">
      <HeroSection />
      <HowItWorksSection />
      <MechanicSection />
      <TopProvidersSection
        providers={providers}
        handleRequestQuote={handleRequestQuote}
        loading={providersLoading}
      />
      <RecentRequestsSection
        requests={requests}
        loading={requestsLoading}
        error={requestsError as Error | null}
        getUrgencyColor={getUrgencyColor}
      />
      <CTASection />
      <Footer />
    </div>
  );
}
