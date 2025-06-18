import React from 'react';
// import { User } from '../../types'; // Removed User type import

interface UserAvatarProps {
  user: { name: string; profilePic?: string | null };
  size?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  size = 'h-10 w-10' // Default size
}) => {
  const avatarSrc = user.profilePic || `https://ui-avatars.com/api/?name=${user.name}&background=4F46E5&color=fff`;

  return (
    <div className={`avatar ${size}`}>
      <img 
        src={avatarSrc} 
        alt={user.name} 
        className="rounded-full"
      />
    </div>
  );
};

export default UserAvatar;