import React from 'react';

interface UserAvatarProps {
  user: {
    name: string;
    profilePic?: string | null; // Treat as avatarUrl
    status?: 'online' | 'offline' | string;
  };
  size?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  size = 'h-10 w-10' // Default Tailwind size
}) => {
  const getInitials = (name: string) => {
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const statusColorClass = () => {
    switch (user.status) {
      case 'online':
        return 'bg-green-500';
      case 'offline':
        return 'bg-gray-400';
      default:
        return 'bg-gray-300'; // Or some other default/hidden state
    }
  };

  return (
    <div className={`relative inline-block ${size}`}>
      {user.profilePic ? (
        <img
          src={user.profilePic}
          alt={user.name}
          className={`rounded-full object-cover w-full h-full`}
        />
      ) : (
        <div
          className={`flex items-center justify-center rounded-full bg-primary-500 text-white w-full h-full text-xs font-semibold`}
        >
          {getInitials(user.name)}
        </div>
      )}
      {user.status && ( // Only show status indicator if status is provided
        <span
          className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white ${statusColorClass()}`}
          title={user.status}
        />
      )}
    </div>
  );
};

export default UserAvatar;