import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

interface SocketState {
  socket: Socket | null;
  isConnected: boolean;
  connect: (namespace: string, userId: string, token: string) => void;
  disconnect: () => void;
  emit: (event: string, data: any) => void;
  on: (event: string, handler: (data: any) => void) => void;
  off: (event: string) => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Centralized Socket.IO management
 * Single socket connection for all real-time features
 */
export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  isConnected: false,

  connect: (namespace: string, userId: string, token: string) => {
    const existingSocket = get().socket;
    if (existingSocket?.connected) {
      return;
    }

    const socket = io(`${API_URL}${namespace}`, {
      query: { userId },
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      set({ isConnected: true });
    });

    socket.on('disconnect', () => {
      set({ isConnected: false });
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    set({ socket, isConnected: socket.connected });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  emit: (event: string, data: unknown) => {
    const { socket } = get();
    if (socket?.connected) {
      socket.emit(event, data);
    }
  },

  on: (event: string, handler: (data: any) => void) => {
    const { socket } = get();
    if (socket) {
      socket.on(event, handler);
    }
  },

  off: (event: string) => {
    const { socket } = get();
    if (socket) {
      socket.off(event);
    }
  },
}));
