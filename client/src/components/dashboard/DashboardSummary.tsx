import React from 'react';
import { useMessages } from '../../hooks/useMessages';
import { useNotifications } from '../../hooks/useNotifications';
import { useCirculars } from '../../hooks/useCirculars';
import { useAuth } from '../../hooks/useAuth';
import { MessageSquare, Bell, FileText, Users } from 'lucide-react';
import StatCard from '../shared/StatCard';

const DashboardSummary = () => {
  const { user } = useAuth();
  const { messages } = useMessages();
  const { unreadCount } = useNotifications(user?.role, user?.id);
  const { circulars } = useCirculars();

  const stats = [
    {
      id: 1,
      name: 'Unread Messages',
      value: messages.length,
      icon: MessageSquare,
      color: 'bg-blue-600',
    },
    {
      id: 2,
      name: 'New Notifications',
      value: unreadCount,
      icon: Bell,
      color: 'bg-amber-600',
    },
    {
      id: 3,
      name: 'Recent Circulars',
      value: circulars.length,
      icon: FileText,
      color: 'bg-emerald-600',
    },
    {
      id: 4,
      name: 'Active Users',
      value: user?.role === 'admin' ? '328' : undefined, // Placeholder for admin
      icon: Users,
      color: 'bg-purple-600',
      adminOnly: true,
    },
  ];

  const filteredStats = stats.filter(
    (stat) => (!stat.adminOnly || user?.role === 'admin') && stat.value !== undefined
  );

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredStats.map((stat) => (
          <StatCard
            key={stat.id}
            name={stat.name}
            value={stat.value as number | string}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardSummary;