import React from 'react';
import { Notification } from '../../types';
import { format } from 'date-fns';
import { Bell, AlertTriangle, CalendarClock, Info, CheckCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
}) => {
  const getNotificationIcon = (title: string) => {
    if (title.toLowerCase().includes('alert') || title.toLowerCase().includes('urgent')) {
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    } else if (title.toLowerCase().includes('event') || title.toLowerCase().includes('deadline')) {
      return <CalendarClock className="h-5 w-5 text-purple-500" />;
    } else if (title.toLowerCase().includes('success') || title.toLowerCase().includes('complete')) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else {
      return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div
      key={notification.id}
      className={cn(
        "p-4 hover:bg-gray-50 transition-colors",
        !notification.isRead && "bg-blue-50"
      )}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          {getNotificationIcon(notification.title)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-medium text-gray-900">
              {notification.title}
            </h3>
            <p className="text-xs text-gray-500">
              {format(new Date(notification.sentAt), 'MMM d, p')}
            </p>
          </div>

          <p className="text-sm text-gray-600 mb-2">
            {notification.description}
          </p>

          {!notification.isRead && (
            <button
              onClick={() => onMarkAsRead(notification.id)}
              className="text-xs font-medium text-primary-600 hover:text-primary-500"
            >
              Mark as read
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
