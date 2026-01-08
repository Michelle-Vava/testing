import { useAuth } from '@/features/auth/hooks/use-auth';
import { authGateStore } from '@/features/auth/stores/auth-gate-store';
import { useNavigate } from '@tanstack/react-router';

export function ProviderSection() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleApplyClick = () => {
    if (!user) {
      authGateStore.open({ action: 'apply as a provider', role: 'provider' });
    } else if (user.role === 'provider') {
      navigate({ to: '/provider/dashboard' });
    } else {
      navigate({ to: '/auth/signup', search: { role: 'provider' } });
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Are you a provider or auto shop?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Join Shanda to receive verified service requests and send quotes directly to drivers.
          </p>
          <button
            onClick={handleApplyClick}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-md"
          >
            Apply as a Provider
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
