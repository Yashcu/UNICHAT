import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { 
  MessageSquare, 
  FileText, 
  Bell, 
  // HelpCircle, // Removed unused import
  Settings, 
  LogOut, 
  Users, 
  Home 
} from 'lucide-react';
import SidebarNavItem from './SidebarNavItem';
import UserAvatar from '../shared/UserAvatar';
import ThemeToggleButton from '../shared/ThemeToggleButton'; // Import ThemeToggleButton

const Sidebar = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { 
      path: '/', 
      label: 'Dashboard', 
      icon: Home, 
      roles: ['student', 'faculty', 'admin'] 
    },
    { 
      path: '/chats', 
      label: 'Messages', 
      icon: MessageSquare, 
      roles: ['student', 'faculty', 'admin'] 
    },
    { 
      path: '/circulars', 
      label: 'Circulars', 
      icon: FileText, 
      roles: ['student', 'faculty', 'admin'] 
    },
    { 
      path: '/notifications', 
      label: 'Notifications', 
      icon: Bell, 
      roles: ['student', 'faculty', 'admin'] 
    },
    { 
      path: '/users', 
      label: 'Manage Users', 
      icon: Users, 
      roles: ['admin'] 
    },
    { 
      path: '/settings', 
      label: 'Settings', 
      icon: Settings, 
      roles: ['student', 'faculty', 'admin'] 
    },
  ];

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(user?.role || 'student')
  );

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="rounded-full bg-primary-500 text-white p-2"> {/* Assuming primary-500 is okay on dark, or adjust if needed */}
            <MessageSquare size={20} />
          </div>
          <h1 className="text-xl font-bold text-primary-500">Unichat AI</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-4 space-y-1">
          {filteredNavItems.map((item) => (
            <SidebarNavItem
              key={item.path}
              path={item.path}
              label={item.label}
              icon={item.icon}
            />
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="mb-4"> {/* Added a div for better spacing if needed */}
          <ThemeToggleButton />
        </div>
        <div className="flex items-center space-x-3 mb-4">
          {/* Using the reusable UserAvatar component */}
          <UserAvatar user={user || { name: 'User' }} size="h-10 w-10" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {user?.name || 'User Name'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize truncate">
              {user?.role || 'student'}
            </p>
          </div>
        </div>
        
        <button 
          onClick={logout}
          className="flex w-full items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;