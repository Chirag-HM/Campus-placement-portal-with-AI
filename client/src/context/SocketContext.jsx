import { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '@/hooks/useAuth';

export const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socket) { socket.disconnect(); setSocket(null); }
      return;
    }

    const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => console.log('🔌 Socket connected'));
    newSocket.on('disconnect', () => console.log('🔌 Socket disconnected'));

    setSocket(newSocket);

    return () => { newSocket.disconnect(); };
  }, [isAuthenticated, token]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}
