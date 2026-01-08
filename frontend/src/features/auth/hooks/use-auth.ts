import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  authControllerSignup,
  authControllerLogin,
  authControllerGetMe
} from '@/api/generated/auth/auth';
import { customInstance, AXIOS_INSTANCE, setAccessToken } from '@/lib/axios';
import type { SignupDto } from '@/api/generated/model';
import type { User, UserRole } from '@/shared/types/user';

interface UpdateProfileDto {
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  businessName?: string;
  serviceTypes?: string[];
  yearsInBusiness?: number;
  onboardingComplete?: boolean;
  shopAddress?: string;
  shopCity?: string;
  shopState?: string;
  shopZipCode?: string;
  serviceRadius?: number; // Note: Backend uses serviceArea string[], but frontend sends radius. Logic handles this? No, backend ignores it.
}

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  loginWithSupabase: (supabaseToken: string) => Promise<User>;
  signup: (data: SignupDto) => Promise<User>;
  logout: () => void;
  selectRole: (role: UserRole) => void;
  switchRole: (role: UserRole) => void;
  hasRole: () => boolean;
  hasCompletedOnboarding: () => boolean;
  updateProfile: (data: UpdateProfileDto) => Promise<void>;
  isUpdatingProfile: boolean;
  refreshUser: () => Promise<void>;
}

function getStoredUser(): User | null {
  const stored = localStorage.getItem('user');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
}

function setStoredUser(user: User | null) {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }
}

/**
 * Check if user is authenticated by checking for CSRF token cookie
 * No longer use localStorage for tokens
 * Optimistically return true if we have stored user, actual auth check will happen via query
 */
function isAuthenticated(): boolean {
  // We can't check httpOnly cookie from JS, so we rely on:
  // 1. Initial load: Do we have a user in localStorage? (Rough guess)
  // 2. Query execution: The request to /auth/me will fail if cookies are missing/invalid
  return !!localStorage.getItem('user');
}

export function useAuth(): UseAuthReturn {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(getStoredUser());

  const { data: currentUser, isLoading: isCheckingAuth } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      if (!isAuthenticated()) return null;
      try {
        const user = await authControllerGetMe() as any;
        setStoredUser(user);
        return user;
      } catch (error) {
        setStoredUser(null);
        return null;
      }
    },
    enabled: isAuthenticated(),
    retry: false, // Don't retry failed auth checks
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
    }
  }, [currentUser]);

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await authControllerLogin({ email, password }) as any;
      return response;
    },
    onSuccess: (response) => {
      // Set access token in memory
      if (response.accessToken) {
        setAccessToken(response.accessToken);
      }
      
      setUser(response.user);
      setStoredUser(response.user);
      // Seed the cache instead of invalidating (prevents immediate redundant 401 risk)
      queryClient.setQueryData(['auth', 'me'], response.user);
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data: SignupDto) => {
      const response = await authControllerSignup(data) as any;
      return response;
    },
    onSuccess: (response) => {
      // Set access token in memory
      if (response.accessToken) {
        setAccessToken(response.accessToken);
      }

      setUser(response.user);
      setStoredUser(response.user);
      // Seed the cache instead of invalidating
      queryClient.setQueryData(['auth', 'me'], response.user);
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateProfileDto) => {
      const response = await customInstance({
        url: '/auth/profile',
        method: 'PUT',
        data,
      });
      return response as any;
    },
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      setStoredUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });

  const login = useCallback(async (email: string, password: string): Promise<User> => {
    const result = await loginMutation.mutateAsync({ email, password });
    return result.user;
  }, [loginMutation]);

  const loginWithSupabase = useCallback(async (supabaseToken: string): Promise<User> => {
    // For OAuth, the backend handles token exchange and sets cookies
    // This method is now primarily for legacy compatibility
    const user = await authControllerGetMe() as any;
    setUser(user);
    setStoredUser(user);
    queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    return user;
  }, [queryClient]);

  const signup = useCallback(async (data: SignupDto): Promise<User> => {
    const result = await signupMutation.mutateAsync(data);
    return result.user;
  }, [signupMutation]);

  const logout = useCallback(async () => {
    // Call backend logout to clear cookies
    try {
      await AXIOS_INSTANCE.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    // Clear local state
    setAccessToken(null); // This clears localStorage 'access_token' via axios helper
    localStorage.removeItem('user'); // Manual clear of user
    
    setUser(null);
    setStoredUser(null);
    queryClient.clear();
  }, [queryClient]);

  const selectRole = useCallback((role: UserRole) => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      setStoredUser(updatedUser);
    }
  }, [user]);

  const switchRole = useCallback((role: UserRole) => {
    if (user && user.role === role) {
      setUser({ ...user });
    }
  }, [user]);

  const hasRole = useCallback(() => {
    return user ? user.role !== null : false;
  }, [user]);

  const hasCompletedOnboarding = useCallback(() => {
    return user ? user.onboardingComplete : false;
  }, [user]);

  const updateProfile = useCallback(async (data: UpdateProfileDto): Promise<void> => {
    await updateProfileMutation.mutateAsync(data);
  }, [updateProfileMutation]);

  const refreshUser = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
  }, [queryClient]);

  return {
    user,
    isAuthenticated: user !== null,
    isLoading: loginMutation.isPending || signupMutation.isPending || isCheckingAuth,
    login,
    signup,
    loginWithSupabase,
    logout,
    selectRole,
    switchRole,
    hasRole,
    hasCompletedOnboarding,
    updateProfile,
    isUpdatingProfile: updateProfileMutation.isPending,
    refreshUser,
  };
}
