import { useState } from 'react';
import { Notification, UserRole } from '../types';

// Mock data
const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    title: 'New Circular Posted',
    description: 'Fall Semester 2025 Registration Dates has been posted.',
    sentAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    isRead: false,
    targetRole: 'student',
  },
  {
    id: 'notif-2',
    title: 'Urgent: System Maintenance',
    description: 'The student portal will be down for maintenance tonight from 11 PM to 2 AM.',
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    isRead: false,
  },
  {
    id: 'notif-3',
    title: 'Event Reminder',
    description: 'Campus Career Fair starts tomorrow at 10 AM in the Student Union Building.',
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    isRead: true,
  },
  {
    id: 'notif-4',
    title: 'Deadline Approaching',
    description: 'The deadline for dropping courses without a "W" grade is this Friday.',
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    isRead: true,
  },
  {
    id: 'notif-5',
    title: 'Success: Registration Complete',
    description: 'You have successfully registered for your Fall 2025 courses.',
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    isRead: false,
    targetUserId: 'current-user-id',
  },
];

export const useNotifications = (userRole: UserRole = 'student', userId: string = 'current-user-id') => {
  const [notifications, setNotifications] = useState<Notification[]>(
    mockNotifications.filter(notif => 
      !notif.targetRole || notif.targetRole === userRole || 
      !notif.targetUserId || notif.targetUserId === userId
    )
  );

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
};