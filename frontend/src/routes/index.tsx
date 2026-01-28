import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Landing } from '@/features/marketing/components/Landing';
import { useAuth } from '@clerk/clerk-react';
import { useAuth as useAppAuth } from '@/features/auth/hooks/use-auth';
import { useEffect } from 'react';
import { getPrimaryRole, hasRole, updateStoredUser } from '@/features/auth/utils/auth-utils';

export const Route = createFileRoute('/')({
  component: RootComponent,
});

function RootComponent() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user: appUser } = useAppAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Wait for Clerk to load
    if (!isLoaded) return;
    
    // If signed in and we have user data, redirect directly to dashboard
    if (isSignedIn && appUser) {
      // Force sync before navigation to avoid race conditions
      updateStoredUser(appUser);
      
      const primaryRole = getPrimaryRole(appUser);
      
      // Determine dashboard based on primary role and onboarding status
      let targetPath = '/owner/dashboard';
      
      if (primaryRole === 'provider') {
        // Check provider onboarding status
        const providerStatus = (appUser as any)?.providerStatus;
        if (providerStatus === 'NONE' || providerStatus === 'DRAFT') {
          targetPath = '/provider/onboarding';
        } else if (appUser.providerOnboardingComplete) {
          targetPath = '/provider/dashboard';
        } else {
          targetPath = '/provider/onboarding';
        }
      } else {
        // Owner dashboard
        targetPath = '/owner/dashboard';
      }
      
      navigate({ 
        to: targetPath,
        replace: true // Replace history to prevent back button issues
      });
    }
  }, [isLoaded, isSignedIn, appUser, navigate]);
  
  // Loading state - matches callback design for consistency
  if (!isLoaded || (isSignedIn && !appUser)) {
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
                <span className="text-[#CBD5E1] text-sm font-medium">Loading your account...</span>
              </div>
            </div>

            {/* Main Message */}
            <div className="text-center">
              <h1 className="text-2xl font-bold text-[#F8FAFC] mb-2">
                Welcome to Service Connect
              </h1>
              <p className="text-[#94A3B8] text-sm">
                Just a moment...
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mt-6 h-1.5 bg-[#334155] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#F5B700] to-[#FFD700] rounded-full animate-pulse w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Not signed in, show landing page
  return <Landing />;
}
