import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  
  // Sidebar
  sidebarPinned: boolean;
  setSidebarPinned: (pinned: boolean) => void;
  
  // Notifications (optional future use)
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
}

/**
 * Global UI state management
 * Handles theme, sidebar state, and other UI preferences
 * Persisted to localStorage automatically
 */
export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Theme state
      theme: 'light',
      setTheme: (theme) => {
        set({ theme });
        // Apply theme to document
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', theme === 'dark');
        }
      },
      
      // Sidebar state
      sidebarPinned: false,
      setSidebarPinned: (pinned) => set({ sidebarPinned: pinned }),
      
      // Notifications
      notificationsEnabled: true,
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
    }),
    {
      name: 'ui-preferences',
      partialize: (state) => ({
        theme: state.theme,
        sidebarPinned: state.sidebarPinned,
        notificationsEnabled: state.notificationsEnabled,
      }),
      onRehydrateStorage: () => (state) => {
        // Apply theme from storage on page load
        if (state && typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', state.theme === 'dark');
        }
      },
    }
  )
);

// Selector hooks for better performance
export const useTheme = () => useUIStore((state) => state.theme);
export const useSidebarPinned = () => useUIStore((state) => state.sidebarPinned);
