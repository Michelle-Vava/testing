import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useAuth as useAppAuth } from '@/features/auth/hooks/use-auth';
import { customInstance } from '@/lib/axios';

/**
 * OAuth Callback Handler
 * Handles post-authentication routing ONLY after OAuth redirect from Clerk
 * This is the page Clerk redirects to after sign-in/sign-up
 */
function AuthCallback() {
  const navigate = useNavigate();
  const { user: clerkUser, isSignedIn, isLoaded } = useUser();
  const { user: appUser, refreshUser } = useAppAuth();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    const processAuth = async () => {
      if (isSignedIn && clerkUser) {
        // Get the landing page context (if user just signed up)
        const landingPage = sessionStorage.getItem('landingPage');
        
        // Determine role based on landing page for NEW users
        const isProviderLanding = landingPage === '/providers';
        
        // Wait for backend user to be created/synced via webhook
        let attempts = 0;
        while (!appUser && attempts < 10) {
          await new Promise(resolve => setTimeout(resolve, 500));
          await refreshUser();
          attempts++;
        }
        
        // If this is a new user (no roles assigned yet), set their initial role via backend
        if (appUser && (!appUser.roles || appUser.roles.length === 0)) {
          const initialRole = isProviderLanding ? 'provider' : 'owner';
          
          try {
            // Call backend API to set user role (backend is source of truth)
            await customInstance.put('/auth/update-roles', {
              roles: [initialRole],
            });
            
            // Refresh user data from backend
            await refreshUser();
          } catch (error) {
            console.error('Failed to set initial role:', error);
            // Continue anyway - backend might have already set a default role
          }
        }
        
        // Clean up landing page context
        sessionStorage.removeItem('landingPage');
        
        // Navigate based on final user role
        const userRoles = appUser?.roles || [];
        const primaryRole = userRoles[0] || 'owner';
        
        if (primaryRole === 'provider') {
          navigate({ to: '/provider/onboarding', replace: true });
        } else {
          navigate({ to: '/owner/dashboard', replace: true });
        }
      } else {
        // Not signed in? Go back to home
        navigate({ to: '/', replace: true });
      }
      
      setIsProcessing(false);
    };

    processAuth();
  }, [isLoaded, isSignedIn, clerkUser, appUser, navigate, refreshUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#070B12] via-[#0B1220] to-[#0F172A] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-[#1E293B]/50 backdrop-blur-sm border border-[#334155]/30 rounded-2xl p-8 shadow-2xl">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#F5B700] to-[#FFD700] rounded-2xl flex items-center justify-center shadow-lg shadow-[#F5B700]/20 animate-pulse">
              <svg 
                className="w-12 h-12 text-[#070B12]" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 10V3L4 14h7v7l9-11h-7z" 
                />
              </svg>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#F5B700] animate-pulse" />
              <span className="text-[#CBD5E1] text-sm font-medium">
                {isProcessing ? 'Setting up your account...' : 'Almost there...'}
              </span>
            </div>
            <div className="flex items-center gap-3 pl-3">
              <div className={`w-1.5 h-1.5 rounded-full ${
                isProcessing ? 'bg-[#64748B]' : 'bg-[#F5B700]'
              }`} />
              <span className={`text-sm ${
                isProcessing ? 'text-[#64748B]' : 'text-[#CBD5E1] font-medium'
              }`}>
                Preparing your dashboard
              </span>
            </div>
          </div>

          {/* Main Message */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#F8FAFC] mb-2">
              Welcome to Shanda
            </h1>
            <p className="text-[#94A3B8] text-sm">
              Just a moment while we get everything ready...
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 h-1.5 bg-[#334155] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#F5B700] to-[#FFD700] rounded-full transition-all duration-1000" 
              style={{ width: isProcessing ? '60%' : '100%' }}
            />
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-[#64748B] text-xs mt-6">
          This usually takes just a few seconds
        </p>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/auth/callback')({
  component: AuthCallback,
});
