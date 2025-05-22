import React from 'react';
import { useAuth } from '../hooks/useAuth';
import DashboardSummary from '../components/dashboard/DashboardSummary';
import RecentActivities from '../components/dashboard/RecentActivities';

const HomePage = () => {
  const { user } = useAuth();

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
    </div>
  );
};

export default HomePage;