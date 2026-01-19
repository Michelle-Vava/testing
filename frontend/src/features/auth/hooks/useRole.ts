import { useSession } from './useSession';
import { UserRoles } from '@/lib/constants';

/**
 * Derives user role information from session
 * Centralizes role-based business logic
 */
export function useRole() {
  const { user } = useSession();

  const isOwner = user?.role === UserRoles.OWNER;
  const isProvider = user?.role === UserRoles.PROVIDER;
  const isAdmin = user?.role === UserRoles.ADMIN;

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
