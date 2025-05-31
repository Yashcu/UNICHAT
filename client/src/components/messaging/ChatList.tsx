import React, { useState, useMemo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Chat } from '../../types';
import { format } from 'date-fns';
import { Search, Plus } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ChatListProps {
  chats: Chat[];
  onSelectChat: (chatId: string) => void;
  selectedChatId?: string;
}

const ChatList: React.FC<ChatListProps> = React.memo(({ 
  chats, 
  onSelectChat, 
  selectedChatId 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const filteredChats = useMemo(() => (
    debouncedSearch
      ? chats.filter(chat =>
          chat.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          chat.members.some(member =>
            member.name.toLowerCase().includes(debouncedSearch.toLowerCase())
          )
        )
      : chats
  ), [chats, debouncedSearch]);

  const handleSelectChat = useCallback((chatId: string) => {
    onSelectChat(chatId);
  }, [onSelectChat]);

  // Virtualized row renderer
  const Row = useCallback(({ index, style }) => {
    const chat = filteredChats[index];
    const otherMember = chat.isGroup 
      ? null 
      : chat.members.find(m => m.id !== 'current-user-id');
    const displayName = chat.isGroup 
      ? chat.name 
      : otherMember?.name || 'Unknown User';
    const avatar = chat.isGroup 
      ? `https://ui-avatars.com/api/?name=${chat.name || 'Group'}&background=4F46E5&color=fff` 
      : otherMember?.profilePic || `https://ui-avatars.com/api/?name=${otherMember?.name || 'User'}&background=4F46E5&color=fff`;
    return (
      <div
        key={chat.id}
        style={style}
        className={cn(
          'px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors',
          selectedChatId === chat.id && 'bg-primary-50'
        )}
        onClick={() => handleSelectChat(chat.id)}
      >
        <div className="flex items-start">
          <div className="avatar h-10 w-10 mr-3">
            <img src={avatar} alt={displayName} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900 truncate">
                {displayName}
              </p>
              {chat.lastMessage && (
                <p className="text-xs text-gray-500">
                  {format(new Date(chat.lastMessage.createdAt), 'p')}
                </p>
              )}
            </div>
            <p className="text-sm text-gray-500 truncate">
              {chat.lastMessage?.content || 'No messages yet'}
            </p>
          </div>
        </div>
      </div>
    );
  }, [filteredChats, selectedChatId, handleSelectChat]);

  return (
    <div className="h-full flex flex-col border-r border-gray-200">
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800">Messages</h2>
          <button className="text-primary-500 hover:text-primary-600">
            <Plus size={20} />
          </button>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length > 0 ? (
          <List
            height={500}
            itemCount={filteredChats.length}
            itemSize={72}
            width={"100%"}
          >
            {Row}
          </List>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <p className="text-gray-500 mb-2">No chats found</p>
            <p className="text-sm text-gray-400">
              {debouncedSearch ? 'Try a different search term' : 'Start a new conversation'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

export default ChatList;