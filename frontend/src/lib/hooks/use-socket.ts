import { useEffect } from 'react';
import { useSocketStore } from '@/lib/store';
import { useToken } from './use-token';
import { useAuthStore } from '@/lib/store';

/**
 * Hook to manage socket connection with automatic authentication
 * @param namespace - Socket.IO namespace (e.g., '/messages')
 * @param enabled - Whether to connect (default: true)
 */
export const useSocket = (namespace: string = '/messages', enabled: boolean = true) => {
  const { socket, isConnected, connect, disconnect, emit, on, off } = useSocketStore();
  const token = useToken();
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    if (enabled && token && user?.id) {
      connect(namespace, user.id, token);
    }

    return () => {
      if (enabled) {
        disconnect();
      }
    };
  }, [enabled, namespace, token, user?.id, connect, disconnect]);

  return {
    socket,
    isConnected,
    emit,
    on,
    off,
  };
};
