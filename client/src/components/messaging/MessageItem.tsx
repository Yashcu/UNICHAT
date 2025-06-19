import React from 'react';
import { Message, User, Attachment } from '../../types'; // Added Attachment
import { format } from 'date-fns';
import { cn } from '../../utils/cn';
import UserAvatar from '../shared/UserAvatar';
import { FileText, Download } from 'lucide-react'; // Added icons

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
              ? 'bg-primary-500 dark:bg-primary-600 text-white rounded-br-none'
              : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-bl-none'
          )}
        >
          {message.content && <p className="whitespace-pre-wrap break-words">{message.content}</p>}

          {/* Attachments UI */}
          {message.attachments && message.attachments.length > 0 && (
            <div className={`mt-2 grid gap-2 ${message.attachments.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {message.attachments.map((attachment, index) => (
                <div key={index} className="rounded-md border dark:border-gray-600 overflow-hidden">
                  {attachment.fileType.startsWith('image/') && attachment.previewURL ? (
                    <img
                      src={attachment.previewURL}
                      alt={attachment.fileName}
                      className="max-w-full h-auto max-h-48 object-contain rounded-md cursor-pointer"
                      // TODO: Add onClick for modal preview
                    />
                  ) : (
                    <div className="p-2 bg-gray-100 dark:bg-gray-600">
                      <div className="flex items-center space-x-2">
                        <FileText size={24} className="text-gray-500 dark:text-gray-400" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-700 dark:text-gray-200 truncate">{attachment.fileName}</p>
                          <p className="text-xxs text-gray-500 dark:text-gray-400">
                            {attachment.fileType}
                            {attachment.size && ` (${Math.round(attachment.size / 1024)} KB)`}
                          </p>
                        </div>
                        {/* Replace with actual download link when backend provides fileURL */}
                        <a
                          href={attachment.fileURL || attachment.previewURL || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={attachment.fileName}
                          className="text-primary-500 dark:text-primary-400 hover:underline"
                          // onClick={(e) => { if (!attachment.fileURL) e.preventDefault(); }} // Prevent click if no real URL
                        >
                          <Download size={16} />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Reactions UI */}
          <div className="flex gap-1 mt-1">
            {['👍', '❤️', '😂', '🎉'].map((emoji) => (
              <button
                key={emoji}
                className="text-lg hover:scale-110 transition-transform" // Emoji color might be inherent
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
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Read by {message.readBy.length} users</p>
          )}
          <p
            className={cn(
              'text-xs mt-1',
              isCurrentUser ? 'text-primary-100 dark:text-primary-200/80' : 'text-gray-400 dark:text-gray-500'
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