import { useEffect, useCallback } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useQueryClient } from '@tanstack/react-query';
import { setClerkTokenGetter } from '@/lib/axios';
import { useClerkAuthControllerGetCurrentUser } from '@/services/generated/auth/auth';
import type { UserEntity } from '@/services/generated/model';

// Global flag to track Clerk initialization
declare global {
  interface Window {
    __CLERK_LOADED__?: boolean;
    __AUTH_LOADING__?: boolean;
  }
}

/**
 * ClerkTokenProvider - Sets up axios to use Clerk tokens and syncs BACKEND user to sessionStorage
 * 
 * This is the single source of truth for auth state synchronization:
 * 1. Sets up Clerk token getter for axios
 * 2. Fetches user from YOUR backend (not Clerk)
 * 3. Syncs backend user to sessionStorage for route guards
 * 
 * Must be rendered inside ClerkProvider
 */
export function ClerkTokenProvider({ children }: { children: React.ReactNode }) {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const { user: clerkUser } = useUser();
  const queryClient = useQueryClient();

  // Set global loading flags for route guards
  useEffect(() => {
    window.__CLERK_LOADED__ = isLoaded;
  }, [isLoaded]);

  // Set up token getter for axios
  useEffect(() => {
    setClerkTokenGetter(getToken);
  }, [getToken]);

  // Fetch BACKEND user data (this is the source of truth)
  const { data: backendUserRaw, isLoading: isLoadingUser, isError } = useClerkAuthControllerGetCurrentUser({
    query: {
      enabled: isSignedIn && isLoaded,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
      retryDelay: 1000,
    }
  });

  const backendUser = backendUserRaw as unknown as UserEntity | undefined;

  // Track loading state globally for route guards
  useEffect(() => {
    window.__AUTH_LOADING__ = isSignedIn && isLoadingUser;
  }, [isSignedIn, isLoadingUser]);

  // Sync BACKEND user to sessionStorage (single source of truth)
  useEffect(() => {
    if (isSignedIn && backendUser) {
      // Use backend user data, NOT Clerk user data
      sessionStorage.setItem('user', JSON.stringify(backendUser));
      console.log('Synced backend user to sessionStorage:', backendUser.id);
    } else if (isSignedIn && isError) {
      // Backend fetch failed - use minimal Clerk data as fallback
      // This allows the app to function while backend syncs via webhook
      if (clerkUser) {
        const fallbackUser = {
          id: clerkUser.id,
          externalAuthId: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress || '',
          phone: clerkUser.primaryPhoneNumber?.phoneNumber || '',
          name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User',
          roles: ['owner'],
          onboardingComplete: false,
          providerOnboardingComplete: false,
        };
        sessionStorage.setItem('user', JSON.stringify(fallbackUser));
        console.warn('Using fallback Clerk user data - backend sync may be pending');
      }
    } else if (!isSignedIn && isLoaded) {
      // Clear user data when signed out
      sessionStorage.removeItem('user');
      queryClient.clear();
    }
  }, [isSignedIn, isLoaded, backendUser, isError, clerkUser, queryClient]);

  return <>{children}</>;
}
