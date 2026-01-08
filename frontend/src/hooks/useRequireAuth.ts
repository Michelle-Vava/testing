import { useNavigate } from '@tanstack/react-router';
import { useSession } from './useSession';
import { useEffect } from 'react';

interface UseRequireAuthOptions {
  redirectTo?: string;
  requireRole?: 'OWNER' | 'PROVIDER' | 'ADMIN';
}

/**
 * Route guard hook - ensures authentication
 * Redirects to login if not authenticated
 */
export function useRequireAuth(options: UseRequireAuthOptions = {}) {
  const { redirectTo = '/auth/login', requireRole } = options;
  const { isAuthenticated, user } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: redirectTo });
      return;
    }

    if (requireRole && user?.role !== requireRole) {
      navigate({ to: '/unauthorized' });
    }
  }, [isAuthenticated, user, requireRole, redirectTo, navigate]);

  return {
    isAuthenticated,
    user,
    isAuthorized: !requireRole || user?.role === requireRole,
  };
}
