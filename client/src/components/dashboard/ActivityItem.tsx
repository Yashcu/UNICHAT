import React from 'react';
import { format } from 'date-fns';
import UserAvatar from '../shared/UserAvatar';

interface ActivityItemProps {
  activity: {
    id: string | number;
    type: string;
    user: string;
    action: string;
    target?: string;
    time: Date;
  };
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  return (
    <div key={activity.id} className="py-3 px-2 hover:bg-gray-50 transition-colors">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {/* Using the reusable UserAvatar component */}
          <UserAvatar user={{ name: activity.user }} size="h-10 w-10" />
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
  );
};

export default ActivityItem;