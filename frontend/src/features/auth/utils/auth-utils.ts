/**
 * Authentication utilities for route guards and session management.
 * 
 * These utilities are used by TanStack Router's beforeLoad guards.
 * They provide synchronous access to auth state for routing decisions.
 * 
 * IMPORTANT: These guards now properly handle loading states to avoid
 * race conditions during initial page load.
 * 
 * For component-level auth state, prefer using:
 * - `useAuth()` hook from '@/features/auth/hooks/use-auth'
 */

import { redirect } from '@tanstack/react-router';
import { ROUTES, getDashboardRoute, getOnboardingRoute } from '@/lib/routes';
import { UserRoles } from '@/lib/constants';
import { UserRole } from '@/types/enums';
import type { UserEntity } from '@/services/generated/model';

// Access global auth loading flags
declare global {
  interface Window {
    __CLERK_LOADED__?: boolean;
    __AUTH_LOADING__?: boolean;
  }
}

/**
 * Check if auth is still initializing
 * Returns true if Clerk hasn't loaded yet or backend user fetch is in progress
 */
export function isAuthLoading(): boolean {
  return !window.__CLERK_LOADED__ || window.__AUTH_LOADING__ === true;
}

// ============================================================================
// ROLE HELPER FUNCTIONS
// ============================================================================

/**
 * Check if user has a specific role
 * @param user - User entity
 * @param role - Role to check (e.g., 'owner', 'provider', 'admin')
 * @returns true if user has the role
 */
export function hasRole(user: UserEntity | null, role: string): boolean {
  if (!user || !user.roles) return false;
  return user.roles.includes(role);
}

/**
 * Get the user's primary (first) role
 * @param user - User entity
 * @returns Primary role or 'owner' as default
 */
export function getPrimaryRole(user: UserEntity | null): string {
  if (!user || !user.roles || user.roles.length === 0) return 'owner';
  return user.roles[0];
}

/**
 * Check if user can access owner features
 * @param user - User entity
 * @returns true if user has owner role
 */
export function canAccessOwner(user: UserEntity | null): boolean {
  return hasRole(user, 'owner');
}

/**
 * Check if user can access provider features
 * @param user - User entity
 * @returns true if user has provider role AND has ACTIVE or LIMITED status
 */
export function canAccessProvider(user: UserEntity | null): boolean {
  if (!hasRole(user, 'provider')) return false;
  
  // Provider must have ACTIVE or LIMITED status to access provider dashboard
  const status = (user as any)?.providerStatus as string;
  return status === 'ACTIVE' || status === 'LIMITED';
}

/**
 * Get all roles for a user
 * @param user - User entity
 * @returns Array of role strings (returns a copy to prevent mutation)
 */
export function getUserRoles(user: UserEntity | null): string[] {
  return user?.roles ? [...user.roles] : [];
}

// ============================================================================
// SESSION STORAGE HELPERS
// ============================================================================

/**
 * Get the current user from sessionStorage (tab-isolated)
 * Used by route guards for synchronous auth checks.
 * 
 * NOTE: This returns the BACKEND user data, not Clerk user data.
 * The ClerkTokenProvider syncs backend user to sessionStorage.
 */
export function getStoredUser(): UserEntity | null {
  const stored = sessionStorage.getItem('user');
  if (!stored) return null;
  
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export function isStoredAuthenticated(): boolean {
  return !!getStoredUser();
}

/**
 * Update stored user data
 */
export function updateStoredUser(user: UserEntity): void {
  sessionStorage.setItem('user', JSON.stringify(user));
}

/**
 * Clear auth data from all storage locations
 */
export function clearStoredAuth(): void {
  sessionStorage.removeItem('user');
  localStorage.removeItem('user'); // Clear potential legacy data
  localStorage.removeItem('access_token');
  sessionStorage.removeItem('access_token');
}

/**
 * Require authentication - throws redirect if not authenticated
 * Used in Router beforeLoad
 * 
 * IMPORTANT: During initial page load, this will NOT redirect if auth is still
 * loading. This prevents the "flash of login page" problem.
 */
export function requireAuth(): UserEntity {
  const user = getStoredUser();
  
  // If auth is still loading, don't redirect yet
  // The page will show a loading state and re-check once auth is ready
  if (!user && isAuthLoading()) {
    // Return a minimal user object to prevent redirect during loading
    // Components should check isAuthLoading() and show spinner
    console.log('Auth still loading, deferring redirect check');
    return { 
      id: '', 
      email: '', 
      name: '', 
      roles: [],
      _isLoading: true 
    } as UserEntity & { _isLoading?: boolean };
  }
  
  if (!user) {
    throw redirect({
      to: '/auth/login',
      search: {
        redirect: location.href,
      },
    });
  }
  
  return user;
}

/**
 * Require user to have a role
 * Used in Router beforeLoad
 * NOTE: Does NOT auto-assign default role - backend should set role on user creation
 */
export function requireRole(): UserEntity {
  const user = requireAuth();
  
  // Validate user has at least one role
  if (!user.roles || user.roles.length === 0) {
    console.warn('User has no roles assigned - this should be handled by backend on user creation');
  }
  
  return user;
}

/**
 * Require owner role - redirect if not an owner
 * @returns User entity
 * @throws Redirect to /unauthorized if not owner
 */
export function requireOwner(): UserEntity {
  const user = requireAuth();
  if (!user.roles?.includes('owner')) {
    throw redirect({ to: '/unauthorized' });
  }
  return user;
}

/**
 * Require active provider - redirect to onboarding if not active
 * @returns User entity
 * @throws Redirect to /provider/onboarding if not active provider
 */
export function requireActiveProvider(): UserEntity {
  const user = requireAuth();
  
  if (!user.roles?.includes('provider')) {
    throw redirect({ to: '/unauthorized' });
  }
  
  const providerIsActive = (user as any).providerIsActive;
  if (!providerIsActive) {
    throw redirect({ to: '/provider/onboarding' });
  }
  
  return user;
}

/**
 * Require user to have completed onboarding - throws redirect if not complete
 */
export function requireOnboarding(): UserEntity {
  const user = requireRole();
  
  // If user is in loading state, skip onboarding check
  if ((user as UserEntity & { _isLoading?: boolean })._isLoading) {
    return user;
  }
  
  // Check if we are already on the setup page to avoid infinite loops
  const isSetupPage = window.location.pathname.includes('setup');
  if (isSetupPage) return user;

  // Check onboarding status from BACKEND user data
  const isProvider = hasRole(user, 'provider');
  
  if (isProvider && !user.providerOnboardingComplete) {
    throw redirect({ to: getOnboardingRoute('provider') });
  } else if (!isProvider && !user.onboardingComplete) {
    // For owners, we might not require onboarding - adjust as needed
    // throw redirect({ to: getOnboardingRoute('owner') });
  }
  
  return user;
}

/**
 * Redirect authenticated users away from public pages (login, signup, etc.)
 * 
 * IMPORTANT: During initial page load, this will NOT redirect if auth is still
 * loading. This prevents incorrect redirects during initialization.
 */
export function redirectIfAuthenticated(): void {
  // Don't redirect during auth initialization
  if (isAuthLoading()) {
    return;
  }
  
  const user = getStoredUser();
  
  if (user) {
    const primaryRole = getPrimaryRole(user);
    
    if (primaryRole === UserRoles.PROVIDER && !user.providerOnboardingComplete) { 
      const onboardingPath = getOnboardingRoute(primaryRole);
      throw redirect({ to: onboardingPath });
    } else {
      const dashboardPath = getDashboardRoute(primaryRole);
      throw redirect({ to: dashboardPath });
    }
  }
}
