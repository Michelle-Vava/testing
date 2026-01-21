import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useQueryClient } from '@tanstack/react-query';
import { setClerkTokenGetter } from '@/lib/axios';
import { useClerkAuthControllerGetCurrentUser } from '@/services/generated/auth/auth';
import type { UserEntity } from '@/services/generated/model';

/**
 * ClerkTokenProvider - Sets up axios tokens and syncs backend user
 * 
 * Simple flow:
 * 1. Configure axios to use Clerk JWT tokens
 * 2. Fetch user from backend (webhook creates user on signup)
 * 3. Store in sessionStorage for route guards
 */
export function ClerkTokenProvider({ children }: { children: React.ReactNode }) {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const queryClient = useQueryClient();

  // Set up token getter for axios
  useEffect(() => {
    setClerkTokenGetter(getToken);
  }, [getToken]);

  // Fetch backend user (created by webhook)
  const { data: backendUserRaw } = useClerkAuthControllerGetCurrentUser({
    query: {
      enabled: isSignedIn && isLoaded,
      staleTime: 5 * 60 * 1000,
    }
  });

  const backendUser = backendUserRaw as unknown as UserEntity | undefined;

  // Sync backend user to sessionStorage
  useEffect(() => {
    if (isSignedIn && backendUser) {
      sessionStorage.setItem('user', JSON.stringify(backendUser));
    } else if (!isSignedIn && isLoaded) {
      sessionStorage.removeItem('user');
      queryClient.clear();
    }
  }, [isSignedIn, isLoaded, backendUser, queryClient]);

  return <>{children}</>;
}
