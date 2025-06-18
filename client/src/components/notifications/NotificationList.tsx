import React from 'react';
import { Notification } from '../../types';
// import { format } from 'date-fns'; // Removed format
import { Bell } from 'lucide-react'; // Removed AlertTriangle, CalendarClock, Info, CheckCircle
// import { cn } from '../../utils/cn'; // Removed cn
import NotificationItem from './NotificationItem';

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
}

const NotificationList: React.FC<NotificationListProps> = React.memo(({ 
  notifications, 
  onMarkAsRead 
}) => {

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="rounded-full bg-gray-100 p-4 mb-4">
          <Bell className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No notifications</h3>
        <p className="text-gray-500 max-w-md">
          You're all caught up! We'll notify you when there's something new.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {notifications.map((notification) => (
        <NotificationItem 
          key={notification.id}
          notification={notification}
          onMarkAsRead={onMarkAsRead}
        />
      ))}
    </div>
  );
});

export default NotificationList;