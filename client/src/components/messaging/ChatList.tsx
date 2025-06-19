import React, { useState, useMemo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Chat } from '../../types';
import { format } from 'date-fns';
import { Search, Plus } from 'lucide-react';
import { cn } from '../../utils/cn';
import UserAvatar from '../shared/UserAvatar'; // Import UserAvatar
import { useAuth } from '../../hooks/useAuth'; // Import useAuth

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
  const { user: authUser } = useAuth(); // Renamed to avoid conflict in Row scope

  const Row = useCallback(({ index, style }) => {
    const chat = filteredChats[index];
    // const { user: currentUser } = useAuth(); // Get current user to find other member - use authUser from outer scope
    const currentUser = authUser;

    let userForAvatar: { name: string; profilePic?: string | null; status?: 'online' | 'offline' | string; };
    let displayName: string;

    if (chat.isGroup) {
      displayName = chat.name || 'Group Chat';
      userForAvatar = { name: displayName, profilePic: null }; // Or a generic group icon URL
    } else {
      const otherMember = chat.members.find(m => m.id !== currentUser?.id);
      displayName = otherMember?.name || 'Unknown User';
      userForAvatar = otherMember
        ? { name: otherMember.name, profilePic: otherMember.profilePic, status: otherMember.status }
        : { name: 'Unknown User' };
    }

    return (
      <div
        key={chat.id}
        style={style}
        className={cn(
          'px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors',
          selectedChatId === chat.id && 'bg-primary-50 dark:bg-gray-600'
        )}
        onClick={() => handleSelectChat(chat.id)}
      >
        <div className="flex items-start">
          <div className="mr-3 flex-shrink-0"> {/* Adjusted div for UserAvatar */}
            <UserAvatar user={userForAvatar} size="h-10 w-10" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {displayName}
              </p>
              {chat.lastMessage && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {format(new Date(chat.lastMessage.createdAt), 'p')}
                </p>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {chat.lastMessage?.content || 'No messages yet'}
            </p>
          </div>
        </div>
      </div>
    );
  }, [filteredChats, selectedChatId, handleSelectChat, authUser]); // Added authUser to dependencies

  return (
    <div className="h-full flex flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Messages</h2>
          <button className="text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-500">
            <Plus size={20} />
          </button>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search chats..."
            className="input w-full pl-10 pr-3 py-2 text-sm" // Uses .input from index.css
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length > 0 ? (
          <List
            height={500} // Example height, might need adjustment or dynamic calculation
            itemCount={filteredChats.length}
            itemSize={72} // Standard item size
            width={"100%"}
          >
            {Row}
          </List>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-2">No chats found</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              {debouncedSearch ? 'Try a different search term' : 'Start a new conversation'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

export default ChatList;