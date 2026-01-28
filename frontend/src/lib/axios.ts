import axios, { AxiosRequestConfig, AxiosError, CancelTokenSource } from 'axios';
import { env } from '@/lib/env';
import { eventBus, EVENTS } from '@/lib/event-bus';

/**
 * Extended Promise type that includes a cancel method for request cancellation
 */
export interface CancellablePromise<T> extends Promise<T> {
  cancel: () => void;
}

const getBaseUrl = () => {
  return env.API_URL || 'http://localhost:4201/service-connect';
};

export const AXIOS_INSTANCE = axios.create({
  baseURL: getBaseUrl(),
  timeout: 30000, // 30 seconds
  withCredentials: true, // Enable cookies for cross-origin requests
});

// Clerk token getter - set by ClerkTokenProvider on app initialization
let getClerkToken: (() => Promise<string | null>) | null = null;

/**
 * Set the Clerk token getter function
 * Called by ClerkTokenProvider during app initialization
 */
export const setClerkTokenGetter = (getter: () => Promise<string | null>) => {
  getClerkToken = getter;
};

/**
 * Legacy function - kept for backward compatibility
 * Clerk manages tokens automatically via Bearer header (no manual token setting needed)
 */
export const setAccessToken = (_token: string | null) => {
  // No-op - Clerk manages tokens automatically
};

/**
 * Request interceptor - adds Clerk Bearer token to all requests
 * Tokens are obtained fresh on each request from Clerk SDK
 */
AXIOS_INSTANCE.interceptors.request.use(async (config) => {
  if (getClerkToken) {
    try {
      const token = await getClerkToken();
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Failed to get Clerk token:', error);
    }
  }
  return config;
});

// Helper to show toasts event via event bus
const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'error') => {
  eventBus.emit(EVENTS.SHOW_TOAST, { message, type });
};

// Track if the app has made its first successful request
let hasConnectedOnce = false;

// Intercept responses for global error handling
AXIOS_INSTANCE.interceptors.response.use(
  (response) => {
    // Mark that we've connected successfully at least once
    hasConnectedOnce = true;
    
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    // 1. Network Errors (No response)
    // Only show toast if we've connected before (not on initial page load)
    // and the error is actually a network issue (not cancelled request)
    if (!error.response) {
      if (hasConnectedOnce && error.code !== 'ERR_CANCELED') {
        showToast('Network error. Please check your internet connection.', 'error');
      }
      return Promise.reject(error);
    }

    const { status } = error.response;

    // 2. Handle 401 Unauthorized - Clerk handles token refresh automatically
    // Just reject and let Clerk's SignedIn/SignedOut components handle redirect
    if (status === 401) {
      // Clerk will automatically redirect to sign-in if session expired
      return Promise.reject(error);
    }

    // 3. Handle 403 Forbidden (Unauthorized access)
    if (status === 403) {
      showToast('You do not have permission to perform this action.', 'error');
      return Promise.reject(error);
    }

    // 4. Handle 404 Not Found (Only show for non-GET requests)
    if (status === 404 && originalRequest.method !== 'get') {
      showToast('The requested resource was not found.', 'error');
      return Promise.reject(error);
    }

    // 5. Handle 500 Server Errors - SINGLE toast only
    if (status >= 500) {
      showToast('Something went wrong on our end. Please try again later.', 'error');
      return Promise.reject(error);
    }

    // For all other errors, don't show toast - let components handle it
    return Promise.reject(error);
  }
);

export const customInstance = <T>(config: AxiosRequestConfig, options?: AxiosRequestConfig): CancellablePromise<T> => {
  const source = axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data) as CancellablePromise<T>;

  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};
