import { ClerkProvider } from '@clerk/clerk-react';
import { env } from '@/lib/env';

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider - Wraps the app with Clerk authentication
 * 
 * This is designed to be auth-provider agnostic. To switch to Auth0:
 * 1. Change import to @auth0/auth0-react
 * 2. Change ClerkProvider to Auth0Provider
 * 3. Update environment variables
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const publishableKey = env.CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY environment variable');
  }

  return (
    <ClerkProvider 
      publishableKey={publishableKey}
      afterSignOutUrl="/"
    >
      {children}
    </ClerkProvider>
  );
}
