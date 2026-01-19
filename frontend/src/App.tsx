import React from 'react';
import { RouterProvider } from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/react-query';
import { router } from './lib/router';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AuthProvider } from '@/lib/auth-provider';
import { ClerkTokenProvider } from '@/lib/clerk-token-provider';

/**
 * Root application component
 * 
 * Uses Clerk for authentication.
 * Socket connections are managed via Zustand store (useSocket hook)
 * and initialized per-feature as needed.
 */
export default function App() {
  return (
    <React.StrictMode>
      <ErrorBoundary>
        <AuthProvider>
          <ClerkTokenProvider>
            <QueryClientProvider client={queryClient}>
              <RouterProvider router={router} />
            </QueryClientProvider>
          </ClerkTokenProvider>
        </AuthProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
}
