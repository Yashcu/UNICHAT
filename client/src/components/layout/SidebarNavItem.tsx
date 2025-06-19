import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { LucideIcon } from 'lucide-react';

interface SidebarNavItemProps {
  path: string;
  label: string;
  icon: LucideIcon;
}

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  path,
  label,
  icon: Icon, // Alias icon to Icon to use as a component
}) => {
  return (
    <NavLink
      to={path}
      className={({ isActive }) => cn(
        'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
        isActive
          ? 'bg-primary-100 dark:bg-primary-500/30 text-primary-600 dark:text-primary-200' // Adjusted active state for dark
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
      )}
    >
      <Icon className="mr-3 h-5 w-5" /> {/* Icon color will inherit from text color or can be set explicitly */}
      {label}
    </NavLink>
  );
};

export default SidebarNavItem;