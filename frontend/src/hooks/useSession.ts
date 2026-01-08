import { AuthService } from '@/features/auth/utils/auth-service';
import type { User } from '@/api/generated/model';

/**
 * Core session management hook
 * Provides access to current user identity and authentication state
 */
export function useSession() {
  const user = AuthService.getUser();
  const token = AuthService.getToken();
  const isAuthenticated = AuthService.isAuthenticated();

  return {
    user,
    token,
    isAuthenticated,
    userId: user?.id,
  };
}
