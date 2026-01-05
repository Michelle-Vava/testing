import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  authControllerSignup,
  authControllerLogin,
  authControllerGetMe
} from '@/api/generated/auth/auth';
import { customInstance } from '@/lib/axios';
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
}

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
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

function setToken(token: string | null) {
  if (token) {
    localStorage.setItem('access_token', token);
  } else {
    localStorage.removeItem('access_token');
  }
}

export function useAuth(): UseAuthReturn {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(getStoredUser());

  const { data: currentUser, isLoading: isCheckingAuth } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return null;
      try {
        const user = await authControllerGetMe() as any;
        setStoredUser(user);
        return user;
      } catch (error) {
        setToken(null);
        setStoredUser(null);
        return null;
      }
    },
    enabled: !!localStorage.getItem('access_token'),
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
      setToken(response.token);
      setUser(response.user);
      setStoredUser(response.user);
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data: SignupDto) => {
      const response = await authControllerSignup(data) as any;
      return response;
    },
    onSuccess: (response) => {
      setToken(response.token);
      setUser(response.user);
      setStoredUser(response.user);
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateProfileDto) => {
      const response = await customInstance({
        url: '/shanda/auth/profile',
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

  const signup = useCallback(async (data: SignupDto): Promise<User> => {
    const result = await signupMutation.mutateAsync(data);
    return result.user;
  }, [signupMutation]);

  const logout = useCallback(() => {
    setToken(null);
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
