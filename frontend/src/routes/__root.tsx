import { createRootRoute, Outlet, useLocation } from '@tanstack/react-router';
import { PublicHeader } from '@/components/layout/public-header';
import { NotFound } from '@/components/layout/not-found';
import { AuthGateModal } from '@/features/auth/components/AuthGateModal';
import { ToastProvider } from '@/components/ui/ToastContext';
import { useAuth } from '@/features/auth/hooks/use-auth';

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFound,
});

function RootComponent() {
  const location = useLocation();
  const { user } = useAuth();
  
  // Only show PublicHeader on marketing/auth pages
  // Dashboard routes (owner, provider) have their own headers in layouts
  // Note: '/providers' is the marketing page, '/provider/*...' are dashboard pages
  const isOwnerApp = location.pathname.startsWith('/owner');
  const isProviderApp = location.pathname.startsWith('/provider') && !location.pathname.startsWith('/providers');
  const isAppRoute = isOwnerApp || isProviderApp;
  
  const showPublicHeader = !isAppRoute;

  // App routes (dashboard) need a fixed viewport to prevent double scrollbars
  const rootClass = isAppRoute 
    ? "bg-gray-50 flex flex-col min-h-screen" // App Shell pattern
    : "min-h-screen bg-gray-50";

  return (
    <ToastProvider>
      <div className={`${rootClass} dark:bg-[#070B12]`}>
        {showPublicHeader && <PublicHeader />}
        <Outlet />
        <AuthGateModal />
      </div>
    </ToastProvider>
  );
}
