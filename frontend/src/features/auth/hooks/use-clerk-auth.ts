import { useUser, useClerk, useAuth as useClerkAuth } from '@clerk/clerk-react';
import { useCallback, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { UserEntity } from '@/services/generated/model';
import { UserRole } from '@/types/enums';
import { 
  useClerkAuthControllerGetCurrentUser, 
  useClerkAuthControllerUpdateProfile 
} from '@/services/generated/auth/auth';
import type { UpdateProfileDto } from '@/services/generated/model';
import { updateStoredUser } from '@/features/auth/utils/auth-utils';
import { customInstance } from '@/lib/axios';

interface UseAuthReturn {
  // App user (from your database) - THIS IS THE SOURCE OF TRUTH
  user: UserEntity | null;
  
  // Auth state
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  
  // Actions
  logout: () => Promise<void>;
  selectRole: (role: UserRole) => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  canAccess: (permission: string) => boolean;
  hasCompletedOnboarding: () => boolean;
  
  // Profile Management
  updateProfile: (data: UpdateProfileDto) => Promise<void>;
  isUpdatingProfile: boolean;
  
  // Get auth token for API calls
  getToken: () => Promise<string | null>;
  
  // Refresh user data from backend
  refreshUser: () => Promise<void>;
}

/**
 * useAuth - Authentication hook using Clerk + Backend user data
 * 
 * IMPORTANT: This hook uses your BACKEND database as the source of truth for user data.
 * Clerk handles authentication tokens, but user profile/roles/onboarding status 
 * come from your database (synced via Clerk webhooks).
 * 
 * This hook provides:
 * - Clerk authentication state (tokens, sign in/out)
 * - Your app's user data from backend (roles, onboarding, profile)
 * - Helper functions for roles and onboarding checks
 */
export function useAuth(): UseAuthReturn {
  const { user: clerkUser, isSignedIn, isLoaded } = useUser();
  const { signOut, getToken } = useClerkAuth();
  const { signOut: clerkSignOut } = useClerk();
  const queryClient = useQueryClient();

  // Fetch user data from YOUR backend (single source of truth)
  const { data: appUserRaw, isLoading: isLoadingUser, error: userError, refetch } = useClerkAuthControllerGetCurrentUser({
    query: {
      enabled: isSignedIn && isLoaded,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
      retryDelay: 1000,
    }
  });

  const { mutateAsync: updateProfileMutation, isPending: isUpdatingProfile } = useClerkAuthControllerUpdateProfile();

  // Cast to UserEntity since backend doesn't properly define the return type in OpenAPI
  const appUser = appUserRaw as unknown as UserEntity | undefined;

  // Sync backend user to sessionStorage whenever it changes
  // This keeps sessionStorage in sync for route guards
  useEffect(() => {
    if (appUser) {
      updateStoredUser(appUser);
    }
  }, [appUser]);

  // Logout function - clears both Clerk session and local data
  const logout = useCallback(async () => {
    sessionStorage.removeItem('user');
    queryClient.clear();
    await clerkSignOut();
  }, [clerkSignOut, queryClient]);

  const updateProfile = useCallback(async (data: UpdateProfileDto) => {
    await updateProfileMutation({ data });
    await refetch();
  }, [updateProfileMutation, refetch]);

  // Role helpers - use BACKEND user roles
  const selectRole = useCallback(async (role: UserRole) => {
    if (!appUser) return;
    
    // Call backend to reorder roles array (set primary role)
    try {
      const response = await customInstance.put('/auth/set-primary-role', {
        primaryRole: role
      });
      
      // Update cache with backend response
      const updatedUser = response.data as UserEntity;
      queryClient.setQueryData(['clerkAuthControllerGetCurrentUser'], updatedUser);
      updateStoredUser(updatedUser);
      
      // Refresh to ensure we have latest data
      await refetch();
    } catch (error) {
      console.error('Failed to switch role:', error);
      throw error;
    }
  }, [appUser, queryClient, refetch]);

  const hasRole = useCallback((role: UserRole) => {
    return appUser?.roles?.includes(role) ?? false;
  }, [appUser]);

  const canAccess = useCallback((permission: string) => {
    if (!appUser) return false;
    
    // Basic permission logic mapping - extend as needed
    if (permission.startsWith('owner')) return hasRole('owner');
    if (permission.startsWith('provider')) {
      const isProvider = hasRole('provider');
      const status = appUser.providerProfile?.status;
      // Providers need to be active or limited to access features
      return isProvider && (status === 'ACTIVE' || status === 'LIMITED');
    }
    return false;
  }, [appUser, hasRole]);

  const hasCompletedOnboarding = useCallback(() => {
    if (!appUser) return false;
    
    const isProvider = appUser.roles?.includes('provider');
    
    if (isProvider) {
      return appUser.providerOnboardingComplete ?? false;
    }
    return appUser.onboardingComplete ?? false;
  }, [appUser]);

  const refreshUser = useCallback(async () => {
    const result = await refetch();
    // Sync refreshed data to sessionStorage
    if (result.data) {
      updateStoredUser(result.data as unknown as UserEntity);
    }
  }, [refetch]);

  const getAuthToken = useCallback(async () => {
    return getToken();
  }, [getToken]);

  return {
    user: appUser ?? null,
    isAuthenticated: isSignedIn ?? false,
    isLoading: !isLoaded || (isSignedIn === true && isLoadingUser),
    error: userError as Error | null,
    logout,
    selectRole,
    hasRole,
    canAccess,
    hasCompletedOnboarding,
    updateProfile,
    isUpdatingProfile,
    getToken: getAuthToken,
    refreshUser,
  };
}

/**
 * Hook to get just the auth token (for API calls)
 */
export function useAuthToken() {
  const { getToken } = useClerkAuth();
  return { getToken };
}
