import React from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { useAuth } from '../hooks/useAuth';
import NotificationList from '../components/notifications/NotificationList';
import { BellOff } from 'lucide-react';

const NotificationsPage = () => {
  const { user } = useAuth();
  const { notifications, markAsRead, markAllAsRead } = useNotifications(
    user?.role || 'student',
    user?.id || 'current-user-id'
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">
            Stay updated with important alerts and information
          </p>
        </div>
        
        {notifications.length > 0 && (
          <button 
            onClick={markAllAsRead}
            className="btn-outline flex items-center text-sm"
          >
            <BellOff size={16} className="mr-2" />
            Mark all as read
          </button>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <NotificationList 
          notifications={notifications} 
          onMarkAsRead={markAsRead} 
        />
      </div>
    </div>
  );
};

export default NotificationsPage;