import React from 'react';
import ChatList from '../components/messaging/ChatList';
import ChatWindow from '../components/messaging/ChatWindow';
import { useMessages } from '../hooks/useMessages';

const MessagesPage = () => {
  const { chats, messages, selectedChatId, selectChat, sendMessage, reactToMessage, markMessageRead } = useMessages();
  
  const selectedChat = selectedChatId 
    ? chats.find(chat => chat.id === selectedChatId) || null 
    : null;

  return (
    <div className="h-[calc(100vh-6rem)] flex overflow-hidden bg-white rounded-lg shadow-sm">
      <div className="w-full md:w-1/3 h-full">
        <ChatList 
          chats={chats} 
          onSelectChat={selectChat}
          selectedChatId={selectedChatId || undefined}
        />
      </div>
      
      <div className="hidden md:block md:w-2/3 h-full border-l border-gray-200">
        <ChatWindow 
          chat={selectedChat} 
          messages={messages}
          onSendMessage={sendMessage}
          reactToMessage={reactToMessage}
          markMessageRead={markMessageRead}
        />
      </div>
    </div>
  );
};

export default MessagesPage;