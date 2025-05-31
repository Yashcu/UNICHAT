import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useMessages } from '../hooks/useMessages';
import { useNotifications } from '../hooks/useNotifications';
import { useCirculars } from '../hooks/useCirculars';
import DashboardSummary from '../components/dashboard/DashboardSummary';
import RecentActivities from '../components/dashboard/RecentActivities';

const HomePage = () => {
  const { user } = useAuth();
  const { chats, messages } = useMessages();
  const { notifications } = useNotifications(user?.role, user?.id);
  const { circulars } = useCirculars();

  // Check for empty state
  const hasNoMessages = chats.length === 0 || messages.length === 0;
  const hasNoNotifications = notifications.length === 0;
  const hasNoCirculars = circulars.length === 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening on campus today
        </p>
      </div>

      <DashboardSummary />
      <RecentActivities />

      {(hasNoMessages && hasNoNotifications && hasNoCirculars) && (
        <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded text-yellow-700 text-center">
          No messages, notifications, or circulars to show yet.
        </div>
      )}
    </div>
  );
};

export default HomePage;