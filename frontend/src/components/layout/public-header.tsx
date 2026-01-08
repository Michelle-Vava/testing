import React from 'react';
import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { authGateStore } from '@/features/auth/stores/auth-gate-store';

export const PublicHeader: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAuthPage = location.pathname.startsWith('/auth');
  const isLandingPage = location.pathname === '/';

  const handleLogoClick = (e: React.MouseEvent) => {
    if (user) {
      e.preventDefault();
      const path = user.role === 'owner' ? '/owner/dashboard' : user.role === 'provider' ? '/provider/dashboard' : '/owner/dashboard';
      navigate({ to: path });
    }
  };

  const handleProviderClick = () => {
    if (!user) {
      navigate({ to: '/auth/signup', search: { mode: 'provider' } });
    } else if (user.providerOnboardingComplete) {
      navigate({ to: '/provider/dashboard' });
    } else {
      navigate({ to: '/provider/onboarding' });
    }
  };

  return (
    <header className="bg-[#0F172A] border-b border-[#1E293B] sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" onClick={handleLogoClick} className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#F5B700] rounded-lg flex items-center justify-center shadow-lg shadow-yellow-500/20">
                <svg className="w-5 h-5 text-[#0F172A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-[#FFFFFF]">Shanda</span>
            </div>
          </Link>

          {/* Public Navigation */}
          <div className="flex items-center gap-2">
            {isAuthPage ? (
              <Link
                to="/"
                className="text-[#CBD5E1] hover:text-[#FFFFFF] px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </Link>
            ) : isLandingPage && (
              <>
                <button
                  onClick={handleProviderClick}
                  className="text-[#CBD5E1] hover:text-[#FFFFFF] px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  For Providers
                </button>
                <Link
                  to="/auth/login"
                  search={{ mode: 'owner' }}
                  className="text-[#CBD5E1] hover:text-[#FFFFFF] px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/signup"
                  search={{ mode: 'owner' }}
                  className="bg-[#F5B700] text-[#0F172A] hover:bg-yellow-600 px-4 py-2 rounded-md text-sm font-semibold transition-colors shadow-lg"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
