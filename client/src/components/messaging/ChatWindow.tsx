import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Message, User, Chat } from '../../types';
import { format } from 'date-fns';
import { Send, PaperclipIcon, Info, MessageSquare } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../utils/cn';

interface ChatWindowProps {
  chat: Chat | null;
  messages: Message[];
  onSendMessage: (content: string) => void;
  reactToMessage: (messageId: string, emoji: string) => void;
  markMessageRead: (messageId: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = React.memo(({ 
  chat, 
  messages, 
  onSendMessage, 
  reactToMessage, 
  markMessageRead 
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [debouncedMessage, setDebouncedMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Debounce message input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedMessage(newMessage), 200);
    return () => clearTimeout(handler);
  }, [newMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debouncedMessage.trim()) {
      onSendMessage(debouncedMessage);
      setNewMessage('');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!chat) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-600 mb-4">
            <MessageSquare size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your messages</h3>
          <p className="text-gray-500 max-w-md">
            Select a conversation or start a new one to begin messaging
          </p>
        </div>
      </div>
    );
  }

  const otherUser = chat.isGroup 
    ? null 
    : chat.members.find(m => m.id !== user?.id);
  
  const chatName = chat.isGroup ? chat.name : otherUser?.name;
  const chatAvatar = chat.isGroup 
    ? `https://ui-avatars.com/api/?name=${chat.name || 'Group'}&background=4F46E5&color=fff` 
    : otherUser?.profilePic || `https://ui-avatars.com/api/?name=${otherUser?.name || 'User'}&background=4F46E5&color=fff`;

  // Virtualized message row
  const Row = useCallback(({ index, style }) => {
    const message = messages[index];
    const isCurrentUser = message.senderId === user?.id;
    const handleReaction = (emoji: string) => {
      if (message.id) reactToMessage(message.id, emoji);
    };
    return (
      <div 
        key={message.id} 
        style={style}
        className={cn(
          'flex',
          isCurrentUser ? 'justify-end' : 'justify-start'
        )}
      >
        <div className="flex items-end">
          {!isCurrentUser && (
            <div className="avatar h-8 w-8 mr-2 flex-shrink-0">
              <img 
                src={message.sender?.profilePic || `https://ui-avatars.com/api/?name=${message.sender?.name || 'User'}&background=4F46E5&color=fff`} 
                alt={message.sender?.name || 'User'} 
              />
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
  }, [messages, user, reactToMessage]);

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="px-4 py-3 bg-white border-b border-gray-200 flex items-center">
        <div className="avatar h-10 w-10 mr-3">
          <img src={chatAvatar} alt={chatName} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-medium text-gray-900 truncate">
            {chatName}
          </h2>
          <p className="text-xs text-gray-500">
            {chat.isGroup 
              ? `${chat.members.length} members` 
              : 'Online'
            }
          </p>
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          <Info size={20} />
        </button>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length > 0 ? (
          <List
            height={400}
            itemCount={messages.length}
            itemSize={72}
            width={"100%"}
          >
            {Row}
          </List>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* Message input */}
      <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-200">
        <div className="flex items-center">
          <button 
            type="button" 
            className="text-gray-500 hover:text-gray-700 mr-2"
          >
            <PaperclipIcon size={20} />
          </button>
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={!debouncedMessage.trim()}
            className="ml-2 bg-primary-500 text-white rounded-full p-2 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
});

export default ChatWindow;