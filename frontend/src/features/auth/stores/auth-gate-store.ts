import { create } from 'zustand';
import type { UserRoleType } from '@/lib/constants';

/**
 * Intent for auth gate actions
 */
interface AuthIntent {
  /** URL to return to after auth */
  returnTo?: string;
  /** Action to perform after auth */
  action?: string;
  /** Additional payload data */
  payload?: unknown;
  /** Provider ID for provider-specific actions */
  providerId?: string;
  /** Provider name for display */
  providerName?: string;
  /** Role for role-specific flows */
  role?: UserRoleType;
}

/**
 * Auth gate state
 */
interface AuthGateState {
  /** Whether the auth modal is open */
  isOpen: boolean;
  /** Current auth intent */
  intent: AuthIntent | null;
  
  /** Open the auth gate with optional intent */
  open: (intent?: AuthIntent) => void;
  /** Close the auth gate */
  close: () => void;
  /** Get current intent */
  getIntent: () => AuthIntent | null;
  /** Clear intent without closing */
  clearIntent: () => void;
}

/**
 * Auth gate store for managing auth modal state
 * 
 * Controls the login/signup modal and tracks the user's
 * intended action so they can be redirected after auth.
 * 
 * @example
 * // Open auth gate with return intent
 * const { open } = useAuthGateStore();
 * open({ returnTo: '/dashboard', action: 'view-quotes' });
 * 
 * @example  
 * // Check if open and get intent
 * const { isOpen, intent } = useAuthGateStore();
 * if (isOpen && intent?.returnTo) {
 *   // Handle redirect after auth
 * }
 */
export const useAuthGateStore = create<AuthGateState>((set, get) => ({
  isOpen: false,
  intent: null,

  open: (intent: AuthIntent = {}) => {
    set({ isOpen: true, intent });
  },

  close: () => {
    set({ isOpen: false, intent: null });
  },

  getIntent: () => get().intent,

  clearIntent: () => {
    set({ intent: null });
  },
}));

// Legacy export for backwards compatibility
export const authGateStore = {
  getState: () => useAuthGateStore.getState(),
  open: (intent?: AuthIntent) => useAuthGateStore.getState().open(intent),
  close: () => useAuthGateStore.getState().close(),
  getIntent: () => useAuthGateStore.getState().intent,
  clearIntent: () => useAuthGateStore.getState().clearIntent(),
  subscribe: (listener: () => void) => useAuthGateStore.subscribe(listener),
};
