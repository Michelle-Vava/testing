import { UserRoles } from '@/lib/constants';
import type { UserRoleType } from '@/lib/constants';
import { UserRole } from '@/types/enums';

// Accept both enum and const type for role parameter
type RoleParam = UserRoleType | UserRole;

/**
 * Central route definitions
 * Change routes here once instead of hunting through the codebase
 */

export const ROUTES = {
  // Public
  HOME: '/',
  
  // Auth
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  
  // Owner
  OWNER_SETUP: '/owner/owner-setup',
  OWNER_DASHBOARD: '/owner/dashboard',
  OWNER_VEHICLES: '/owner/vehicles',
  OWNER_REQUESTS: '/owner/requests',
  OWNER_REQUESTS_NEW: '/owner/requests/new',
  OWNER_QUOTES: '/owner/quotes',
  OWNER_JOBS: '/owner/jobs',
  OWNER_SETTINGS: '/owner/settings',
  
  // Provider
  PROVIDER_SETUP: '/provider/provider-setup',
  PROVIDER_DASHBOARD: '/provider/dashboard',
  PROVIDER_JOBS: '/provider/jobs',
  PROVIDER_QUOTES: '/provider/quotes',
} as const;

/**
 * Helper to get dashboard route based on user role
 */
export const getDashboardRoute = (role: RoleParam): string => {
  return role === UserRoles.OWNER ? ROUTES.OWNER_DASHBOARD : ROUTES.PROVIDER_DASHBOARD;
};

/**
 * Helper to get onboarding route based on user role
 */
export const getOnboardingRoute = (role: RoleParam): string => {
  return role === UserRoles.OWNER ? ROUTES.OWNER_SETUP : ROUTES.PROVIDER_SETUP;
};
