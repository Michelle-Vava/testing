type EventCallback = (data: any) => void;

class EventBus {
  private listeners: { [key: string]: EventCallback[] } = {};

  on(event: string, callback: EventCallback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);

    // Return unsubscribe function
    return () => {
      this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
    };
  }

  emit(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback) => callback(data));
    }
  }
}

export const eventBus = new EventBus();

// Specific event types
export const EVENTS = {
  SHOW_TOAST: 'SHOW_TOAST',
  AUTH_ERROR: 'AUTH_ERROR',
};

export interface ToastEvent {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}
