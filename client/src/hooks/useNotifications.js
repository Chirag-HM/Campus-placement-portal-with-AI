import { useContext } from 'react';
import { SocketContext } from '@/context/SocketContext';

export function useNotifications() {
  const context = useContext(SocketContext);
  if (!context) return { notifications: [], clearNotifications: () => {} };
  return { 
    notifications: context.notifications, 
    clearNotifications: context.clearNotifications 
  };
}
