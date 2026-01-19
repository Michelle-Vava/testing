import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserEntity } from '@/services/generated/model';

interface AuthState {
  accessToken: string | null;
  user: UserEntity | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: UserEntity) => void;
  clearAuth: () => void;
  updateUser: (user: UserEntity) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token, user) => 
        set({ 
          accessToken: token, 
          user, 
          isAuthenticated: true 
        }),
      clearAuth: () => 
        set({ 
          accessToken: null, 
          user: null, 
          isAuthenticated: false 
        }),
      updateUser: (user) => 
        set({ user }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        accessToken: state.accessToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Selector hooks for better performance
export const useAccessToken = () => useAuthStore((state) => state.accessToken);
export const useCurrentUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
