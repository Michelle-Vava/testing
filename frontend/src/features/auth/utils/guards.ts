import { AuthService } from '@/features/auth/utils/auth-service';

/**
 * Route guards for TanStack Router's beforeLoad
 * These use AuthService (not useAuth hook) because hooks can't be used in beforeLoad
 */

export function requireAuth() {
  return AuthService.requireAuth();
}

export function requireRole() {
  return AuthService.requireRole();
}

export function requireOnboarding() {
  return AuthService.requireOnboarding();
}

export function redirectIfAuthenticated() {
  return AuthService.redirectIfAuthenticated();
}
