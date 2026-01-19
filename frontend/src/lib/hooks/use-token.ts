import { useAuthStore } from '@/lib/store';

/**
 * Reusable hook to access authentication token
 * Single source of truth for token access across the app
 */
export const useToken = () => {
  return useAuthStore(state => state.accessToken);
};

/**
 * Get token synchronously (for use outside React components)
 * Use this in API interceptors, socket connections, etc.
 */
export const getToken = () => {
  return useAuthStore.getState().accessToken;
};
