import React from 'react';
import { format } from 'date-fns';

const activities = [
  {
    id: 1,
    type: 'message',
    user: 'Dr. Sarah Johnson',
    action: 'sent a message in',
    target: 'Physics Department',
    time: new Date(Date.now() - 1000 * 60 * 25),
  },
  {
    id: 2,
    type: 'circular',
    user: 'Admin',
    action: 'published a new circular',
    target: 'Exam Schedule for Spring 2025',
    time: new Date(Date.now() - 1000 * 60 * 60 * 3),
  },
  {
    id: 3,
    type: 'notification',
    user: 'System',
    action: 'sent a notification',
    target: 'Library hours extended for finals week',
    time: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
  {
    id: 4,
    type: 'chat',
    user: 'James Wilson',
    action: 'created a new group',
    target: 'CS491 Project Team',
    time: new Date(Date.now() - 1000 * 60 * 60 * 8),
  },
];

const RecentActivities = () => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activities</h2>
      
      <div className="card overflow-hidden">
        <div className="divide-y divide-gray-200">
          {activities.map((activity) => (
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
                    {activity.action} <span className="font-medium">{activity.target}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {format(activity.time, 'PPp')}
                  </div>
                </div>
              </div>
            </div>
          ))}
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