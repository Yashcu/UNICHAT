import React from 'react';
import { format } from 'date-fns';
import { useMessages } from '../../hooks/useMessages';
import { useNotifications } from '../../hooks/useNotifications';
import { useCirculars } from '../../hooks/useCirculars';
import { useAuth } from '../../hooks/useAuth';
import ActivityItem from './ActivityItem';
import ViewAllButton from './ViewAllButton';

const RecentActivities = () => {
  const { user } = useAuth();
  const { messages } = useMessages();
  const { notifications } = useNotifications(user?.role, user?.id);
  const { circulars } = useCirculars();

  const activities = [
    ...messages.slice(-3).map((msg) => ({
      id: msg.id,
      type: 'message',
      user: msg.sender?.name || 'Unknown',
      action: 'sent a message',
      target: '',
      time: new Date(msg.createdAt),
    })),
    ...notifications.slice(-3).map((notif) => ({
      id: notif.id,
      type: 'notification',
      user: 'System',
      action: 'sent a notification',
      target: notif.title,
      time: new Date(notif.sentAt),
    })),
    ...circulars.slice(-3).map((circ) => ({
      id: circ.id,
      type: 'circular',
      user: circ.postedBy?.name || 'Admin',
      action: 'published a new circular',
      target: circ.title,
      time: new Date(circ.postedAt),
    })),
  ]
    .sort((a, b) => b.time.getTime() - a.time.getTime())
    .slice(0, 5);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Activities</h2>
      <div className="card border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-200">
          {activities.length === 0 ? (
            <div className="py-6 text-center text-gray-500">No recent activities to show.</div>
          ) : (
            activities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))
          )}
        </div>
        <div className="py-3 px-4 bg-gray-50 border-t border-gray-200">
          <ViewAllButton href="#" />
        </div>
      </div>
    </div>
  );
};

export default RecentActivities;
