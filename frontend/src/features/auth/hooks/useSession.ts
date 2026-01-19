import { getStoredUser, isStoredAuthenticated, isAuthLoading } from '@/features/auth/utils/auth-utils';
import type { UserEntity } from '@/services/generated/model';

/**
 * Core session management hook
 * Provides synchronous access to current user identity and authentication state.
 * 
 * NOTE: For reactive auth state that responds to changes, use useAuth() instead.
 * This hook reads from sessionStorage which is synced by ClerkTokenProvider.
 * 
 * The user data comes from your BACKEND database, not Clerk directly.
 */
export function useSession() {
  const user = getStoredUser();
  const isAuthenticated = isStoredAuthenticated();
  const isLoading = isAuthLoading();

  return {
    user,
    isAuthenticated,
    isLoading,
    userId: user?.id,
  };
}
