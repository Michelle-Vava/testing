import { createRootRoute, Outlet, useLocation } from '@tanstack/react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { PublicHeader } from '@/components/layout/public-header';
import { AuthGateModal } from '@/routes/-components/auth-gate-modal';
import { ToastProvider } from '@/contexts/ToastContext';
import { useAuth } from '@/features/auth/hooks/use-auth';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const location = useLocation();
  const { user } = useAuth();
  
  // Only show PublicHeader on marketing/auth pages
  // Dashboard routes (owner, provider) have their own headers in layouts
  const isAppRoute = location.pathname.startsWith('/owner') || location.pathname.startsWith('/provider');
  const showPublicHeader = !isAppRoute;

  return (
    <ToastProvider>
      <div className={showPublicHeader ? "min-h-screen bg-gray-50" : "h-screen overflow-hidden bg-slate-50"}>
        {showPublicHeader && <PublicHeader />}
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className={showPublicHeader ? '' : 'h-full'}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
        <AuthGateModal />
      </div>
    </ToastProvider>
  );
}
