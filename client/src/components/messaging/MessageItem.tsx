import React from 'react';
import { Message, User } from '../../types';
import { format } from 'date-fns';
import { cn } from '../../utils/cn';
import UserAvatar from '../shared/UserAvatar';

interface MessageItemProps {
  message: Message;
  currentUser: User | null;
  reactToMessage: (messageId: string, emoji: string) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  currentUser,
  reactToMessage,
}) => {
  const isCurrentUser = message.senderId === currentUser?.id;

  const handleReaction = (emoji: string) => {
    if (message.id) reactToMessage(message.id, emoji);
  };

  return (
    <div
      className={cn(
        'flex',
        isCurrentUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div className="flex items-end">
        {!isCurrentUser && message.sender && (
          <div className="avatar h-8 w-8 mr-2 flex-shrink-0">
             {/* Using the reusable UserAvatar component */}
            <UserAvatar user={message.sender} size="h-8 w-8" />
          </div>
        )}
        <div
          className={cn(
            'max-w-xs sm:max-w-md px-4 py-2 rounded-lg',
            isCurrentUser
              ? 'bg-primary-500 text-white rounded-br-none'
              : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
          )}
        >
          <p>{message.content}</p>
          {/* Reactions UI */}
          <div className="flex gap-1 mt-1">
            {['👍', '❤️', '😂', '🎉'].map((emoji) => (
              <button
                key={emoji}
                className="text-lg hover:scale-110 transition-transform"
                onClick={() => handleReaction(emoji)}
                aria-label={`React with ${emoji}`}
                type="button"
              >
                {emoji} {message.reactions?.filter(r => r.emoji === emoji).length || ''}
              </button>
            ))}
          </div>
          {/* Read receipts */}
          {message.readBy && message.readBy.length > 1 && (
            <p className="text-xs text-gray-400 mt-1">Read by {message.readBy.length} users</p>
          )}
          <p
            className={cn(
              'text-xs mt-1',
              isCurrentUser ? 'text-primary-100' : 'text-gray-400'
            )}
          >
            {format(new Date(message.createdAt), 'p')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;