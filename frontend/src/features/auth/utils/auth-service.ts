import { redirect } from '@tanstack/react-router';
import { ROUTES } from '@/config/routes';
import type { User } from '@/shared/types/user';

/**
 * AuthService - Synchronous auth utilities for route guards
 * 
 * IMPORTANT: This is used in TanStack Router's beforeLoad which cannot use React hooks.
 * For component-level auth, use the useAuth() hook instead.
 */
export class AuthService {
  /**
   * Get the current user from localStorage
   */
  static getUser(): User | null {
    const stored = localStorage.getItem('user');
    if (!stored) return null;
    
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }

  /**
   * Get the current auth token
   */
  static getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getUser();
  }

  /**
   * Require authentication - throws redirect if not authenticated
   */
  static requireAuth(): User {
    const user = this.getUser();
    const token = this.getToken();
    
    if (!user || !token) {
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
   * Require user to have selected a role - gives them 'owner' role by default if missing
   */
  static requireRole(): User {
    const user = this.requireAuth();
    
    // Default to 'owner' role if not set
    if (!user.role) {
      user.role = 'owner';
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    return user;
  }

  /**
   * Require user to have completed onboarding - throws redirect if not complete
   * NOTE: Onboarding is currently skipped, so just check for role
   */
  static requireOnboarding(): User {
    const user = this.requireRole();
    
    // Check if we are already on the setup page to avoid infinite loops
    const isSetupPage = window.location.pathname.includes('setup');
    if (isSetupPage) return user;

    if (user.role === 'provider' && !user.providerOnboardingComplete) {
      throw redirect({
        to: '/provider/provider-setup',
      });
    }

    if (user.role === 'owner' && !user.onboardingComplete) {
      throw redirect({
        to: '/owner/owner-setup',
      });
    }
    
    return user;
  }

  /**
   * Redirect authenticated users away from public pages
   */
  static redirectIfAuthenticated(): void {
    const user = this.getUser();
    
    if (user) {
      if (!user.role) {
        // Everyone is an owner by default, redirect to onboarding if needed
        throw redirect({ to: ROUTES.OWNER_SETUP });
      } else if (!user.onboardingComplete) {
        const onboardingPath = user.role === 'owner' 
          ? '/owner/owner-setup' 
          : '/provider/provider-setup';
        throw redirect({ to: onboardingPath });
      } else {
        const dashboardPath = user.role === 'owner' 
          ? '/owner/dashboard' 
          : '/provider/dashboard';
        throw redirect({ to: dashboardPath });
      }
    }
  }

  /**
   * Update stored user data
   */
  static updateUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Clear auth data
   */
  static clearAuth(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
  }
}
