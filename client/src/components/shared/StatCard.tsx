import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  name: string;
  value: string | number;
  icon: LucideIcon;
  color: string; // Tailwind background color class
}

const StatCard: React.FC<StatCardProps> = ({
  name,
  value,
  icon: Icon, // Alias icon to Icon to use as a component
  color,
}) => {
  return (
    <div className="card hover:shadow-lg transition-all duration-200 flex items-center">
      <div className={`${color} p-3 rounded-lg text-white mr-4 shadow-md`}>
        <Icon size={32} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{name}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;