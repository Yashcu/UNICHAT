import React from 'react';
import { format } from 'date-fns';
import { useMessages } from '../../hooks/useMessages';
import { useNotifications } from '../../hooks/useNotifications';
import { useCirculars } from '../../hooks/useCirculars';
import { useAuth } from '../../hooks/useAuth';

const RecentActivities = () => {
  const { user } = useAuth();
  const { messages } = useMessages();
  const { notifications } = useNotifications(user?.role, user?.id);
  const { circulars } = useCirculars();

  // Combine and sort activities by time (most recent first)
  const activities = [
    ...messages.slice(-3).map(msg => ({
      id: msg.id,
      type: 'message',
      user: msg.sender?.name || 'Unknown',
      action: 'sent a message',
      target: '',
      time: new Date(msg.createdAt),
    })),
    ...notifications.slice(-3).map(notif => ({
      id: notif.id,
      type: 'notification',
      user: 'System',
      action: 'sent a notification',
      target: notif.title,
      time: new Date(notif.sentAt),
    })),
    ...circulars.slice(-3).map(circ => ({
      id: circ.id,
      type: 'circular',
      user: circ.postedBy?.name || 'Admin',
      action: 'published a new circular',
      target: circ.title,
      time: new Date(circ.postedAt),
    })),
  ].sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 5);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activities</h2>
      <div className="card overflow-hidden">
        <div className="divide-y divide-gray-200">
          {activities.length === 0 ? (
            <div className="py-6 text-center text-gray-500">No recent activities to show.</div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="py-3 px-2 hover:bg-gray-50 transition-colors">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="avatar h-10 w-10">
                      <img 
                        src={`https://ui-avatars.com/api/?name=${activity.user}&background=4F46E5&color=fff`} 
                        alt={activity.user} 
                      />
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {activity.user}
                    </div>
                    <div className="text-sm text-gray-500">
                      {activity.action} {activity.target && <span className="font-medium">{activity.target}</span>}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {format(activity.time, 'PPp')}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="py-3 px-4 bg-gray-50 border-t border-gray-200">
          <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500">
            View all activities
          </a>
        </div>
      </div>
    </div>
  );
};

export default RecentActivities;