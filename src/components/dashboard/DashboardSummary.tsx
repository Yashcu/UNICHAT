import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { MessageSquare, Bell, FileText, Users } from 'lucide-react';

const DashboardSummary = () => {
  const { user } = useAuth();
  
  const stats = [
    {
      id: 1,
      name: 'Unread Messages',
      value: '24',
      icon: MessageSquare,
      color: 'bg-blue-500',
    },
    {
      id: 2,
      name: 'New Notifications',
      value: '7',
      icon: Bell,
      color: 'bg-amber-500',
    },
    {
      id: 3,
      name: 'Recent Circulars',
      value: '3',
      icon: FileText,
      color: 'bg-emerald-500',
    },
    {
      id: 4,
      name: 'Active Users',
      value: '328',
      icon: Users,
      color: 'bg-purple-500',
      adminOnly: true,
    },
  ];

  const filteredStats = stats.filter(stat => 
    !stat.adminOnly || user?.role === 'admin'
  );

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredStats.map((stat) => (
          <div 
            key={stat.id}
            className="card hover:shadow transition-all duration-200 flex items-center"
          >
            <div className={`${stat.color} p-3 rounded-lg text-white mr-4`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.name}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardSummary;