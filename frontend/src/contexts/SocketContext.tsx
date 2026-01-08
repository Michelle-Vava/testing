import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Check for authentication via stored user check (rough check)
    // The actual socket connection will fail handshake if cookies are missing
    const hasUser = !!localStorage.getItem('user');
    if (!hasUser) {
      return;
    }

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    // Remove /api if it exists in the URL for the socket connection base
    const baseUrl = apiUrl.replace(/\/api$/, '');
    
    // Connect to the 'notifications' namespace
    const socketUrl = `${baseUrl}/notifications`;

    const socketInstance = io(socketUrl, {
      path: '/socket.io',
      withCredentials: true, // Send cookies for auth
      transports: ['websocket'],
    });

    socketInstance.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
