import { useState, useEffect } from 'react';
import { Notification, UserRole } from '../types';
import api from '../utils/api';

// useNotifications hook: fetches notifications from the API and manages read state
export const useNotifications = (userRole: UserRole = 'student', userId: string = 'current-user-id') => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Fetch notifications on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await api.get('/notifications', {
          params: { userRole, userId }
        });
        setNotifications(data);
      } catch (error) {
        setNotifications([]);
      }
    };
    fetchNotifications();
  }, [userRole, userId]);

  // Mark a notification as read
  const markAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(notif => notif.id === id ? { ...notif, isRead: true } : notif));
    } catch (error) {
      // Optionally handle error
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all', { userId });
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
    } catch (error) {
      // Optionally handle error
    }
  };

  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
};