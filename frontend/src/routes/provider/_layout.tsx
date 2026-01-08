import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { Sidebar } from '@/components/layout/sidebar';
import { ProviderHeader } from '@/components/layout/ProviderHeader';
import { Footer } from '@/components/layout/footer';
import { AuthService } from '@/features/auth/utils/auth-service';

export const Route = createFileRoute('/provider/_layout')({
  beforeLoad: async () => {
    // Require authentication
    const user = AuthService.requireAuth();
    
    // Check provider status instead of boolean flag
    const providerStatus = (user as any).providerStatus || 'NONE';
    
    // Route based on provider status
    if (providerStatus === 'NONE' || providerStatus === 'DRAFT') {
      // Not started or incomplete onboarding → redirect to onboarding
      throw redirect({ to: '/provider/onboarding' });
    }
    
    if (providerStatus === 'SUSPENDED') {
      // Account suspended → show suspension page
      throw redirect({ to: '/provider/suspended' });
    }
    
    // LIMITED or ACTIVE status can access dashboard
    // LIMITED users may have restricted features (enforced by backend)
    
    return { user, providerStatus };
  },
  component: ProviderLayout,
});

function ProviderLayout() {
  const sidebarLinks = [
    {
      to: '/provider/dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      to: '/provider/jobs',
      label: 'Available Jobs',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      to: '/messages',
      label: 'Messages',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar links={sidebarLinks} />
      <div className="flex-1 flex flex-col min-w-0">
        <ProviderHeader />
        <div className="flex-1 overflow-y-auto flex flex-col">
          <main className="flex-1 p-8">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
