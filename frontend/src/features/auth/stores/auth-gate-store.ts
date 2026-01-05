type AuthIntent = {
  returnTo?: string;
  action?: string;
  payload?: any;
  providerId?: string;
  providerName?: string;
  role?: 'owner' | 'provider';
};

type Listener = () => void;

class AuthGateStore {
  private isOpen = false;
  private intent: AuthIntent | null = null;
  private listeners: Listener[] = [];

  subscribe(listener: Listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener());
  }

  getState() {
    return {
      isOpen: this.isOpen,
      intent: this.intent,
    };
  }

  open(intent: AuthIntent = {}) {
    this.isOpen = true;
    this.intent = intent;
    this.notify();
  }

  close() {
    this.isOpen = false;
    this.intent = null;
    this.notify();
  }

  getIntent() {
    return this.intent;
  }

  clearIntent() {
    this.intent = null;
    this.notify();
  }
}

export const authGateStore = new AuthGateStore();
