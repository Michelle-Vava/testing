import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { env } from '@/config/env';
import { eventBus, EVENTS } from '@/lib/event-bus';

const getBaseUrl = () => {
  return env.API_URL || 'http://localhost:4201/shanda';
};

export const AXIOS_INSTANCE = axios.create({
  baseURL: getBaseUrl(),
  timeout: 30000, // 30 seconds
  withCredentials: true, // Enable cookies for cross-origin requests
});

// CSRF token and Access Token storage
// initializing with localStorage to ensure persistence across reloads
let accessToken: string | null = localStorage.getItem('access_token');
let isRefreshing = false;
let failedQueue: any[] = [];

export const setAccessToken = (token: string | null) => {
  accessToken = token;
  if (token) {
    localStorage.setItem('access_token', token);
  } else {
    localStorage.removeItem('access_token');
  }
};

const processQueue = (error: any, token: any = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

AXIOS_INSTANCE.interceptors.request.use((config) => {
  // Add Bearer token if available
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  } else {
    // Debug log to see why token is missing
    // console.log('Request without access token:', config.url);
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

    // 2. Handle 403 Forbidden (Unauthorized access)
    if (status === 403) {
      showToast('You do not have permission to perform this action.', 'error');
      // Optional: Redirect to unauthorized page
      // window.location.href = '/unauthorized';
      return Promise.reject(error);
    }

    // 3. Handle 404 Not Found (Only for GET requests mainly, prevents spamming on search)
    if (status === 404 && originalRequest.method !== 'get') {
      showToast('The requested resource was not found.', 'error');
    }

    // 4. Handle 500 Server Errors
    if (status >= 500) {
      showToast('Something went wrong on our end. Please try again later.', 'error');
    }

    // 5. Handle 401 Unauthorized (Token Expiration) with queueing
    if (status === 401 && !originalRequest._retry) {
      
      // Don't show session expired toast for initial auth check (GET /auth/me)
      const isAuthCheck = originalRequest.url?.includes('/auth/me');
      
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          return AXIOS_INSTANCE(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh token
        const { data } = await axios.post(`${getBaseUrl()}/auth/refresh`, {}, { withCredentials: true });
        
        // Update access token if returned
        if (data.accessToken) {
          setAccessToken(data.accessToken);
        }

        processQueue(null, true);
        return AXIOS_INSTANCE(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        setAccessToken(null); // Clear token on failure
        
        // Only redirect to login and show toast if not an auth check
        isRefreshing = false;
      }
    }
    
    // Improve error message extract
    const message = (error.response?.data as any)?.message || error.message || 'An unexpected error occurred';
    
    // Don't show toast for 401s (handled above) or 404 GETs
    if (status !== 401 && !(status === 404 && originalRequest.method === 'get')) {
       // Only show specific error toast if not already handled by generic handlers above
       if (status < 500 && status !== 403) {
          showToast(Array.isArray(message) ? message[0] : message, 'error');
       }
    }

    return Promise.reject(error);
  }
);

export const customInstance = <T>(config: AxiosRequestConfig, options?: AxiosRequestConfig): Promise<T> => {
  const source = axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};
