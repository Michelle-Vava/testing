/**
 * use-auth.ts - Re-exports Clerk authentication hook
 * 
 * This file maintains backward compatibility for existing imports.
 * All auth is now handled by Clerk.
 */

export { useAuth, useAuthToken } from './use-clerk-auth';
