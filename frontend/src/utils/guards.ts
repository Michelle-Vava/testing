/**
 * Route guards for TanStack Router's beforeLoad
 * Re-exports from auth-utils for convenience
 */
export { 
  requireAuth, 
  requireRole, 
  requireOnboarding, 
  redirectIfAuthenticated 
} from '@/features/auth/utils/auth-utils';
