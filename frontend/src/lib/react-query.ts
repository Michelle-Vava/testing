import { QueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

// Extract error message from various error formats
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'object' && error !== null) {
    if ('message' in error && typeof error.message === 'string') {
      return error.message;
    }
    if ('error' in error && typeof error.error === 'string') {
      return error.error;
    }
  }
  return 'An unexpected error occurred';
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on 401, 403, 404
        if (error?.response?.status && [401, 403, 404].includes(error.response.status)) {
          return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      onError: (error) => {
        const message = getErrorMessage(error);
        // Only show toast for mutations, not queries
        if (typeof toast !== 'undefined') {
          toast.error(message);
        } else {
          console.error('Mutation error:', message);
        }
      },
    },
  },
});
