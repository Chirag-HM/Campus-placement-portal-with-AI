import { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '@/hooks/useAuth';

export const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
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
    
    newSocket.on('job-posted', (job) => {
      setNotifications(prev => [{
        id: Date.now(),
        type: 'job',
        title: 'New Job Posted',
        message: `${job.title} at ${job.company}`,
        time: new Date(),
        link: `/jobs/${job._id}`
      }, ...prev]);
    });

    newSocket.on('application-update', (data) => {
      setNotifications(prev => [{
        id: Date.now(),
        type: 'application',
        title: 'Application Update',
        message: `Your application for ${data.jobTitle} at ${data.company} is now ${data.status}`,
        time: new Date(),
        link: '/tracker'
      }, ...prev]);
    });

    setSocket(newSocket);
    return () => { newSocket.disconnect(); };
  }, [isAuthenticated, token]);

  const clearNotifications = () => setNotifications([]);

  return (
    <SocketContext.Provider value={{ socket, notifications, clearNotifications }}>
      {children}
    </SocketContext.Provider>
  );
}
