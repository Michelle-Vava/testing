import { useSession } from './useSession';

/**
 * Derives user role information from session
 * Centralizes role-based business logic
 */
export function useRole() {
  const { user } = useSession();

  const isOwner = user?.role === 'OWNER';
  const isProvider = user?.role === 'PROVIDER';
  const isAdmin = user?.role === 'ADMIN';

  // Provider-specific checks
  const isVerifiedProvider = isProvider && user?.isVerified === true;
  const needsOnboarding = isProvider && !user?.isVerified;

  return {
    role: user?.role,
    isOwner,
    isProvider,
    isAdmin,
    isVerifiedProvider,
    needsOnboarding,
  };
}
