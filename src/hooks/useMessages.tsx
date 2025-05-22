import { useState, useEffect } from 'react';
import { Chat, Message, User } from '../types';
import { useAuth } from './useAuth';

// Mock data
const mockUsers: User[] = [
  {
    id: 'current-user-id',
    name: 'You',
    email: 'you@university.edu',
    role: 'student',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-2',
    name: 'Sarah Johnson',
    email: 'sarah@university.edu',
    role: 'faculty',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-3',
    name: 'Michael Chen',
    email: 'michael@university.edu',
    role: 'student',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-4',
    name: 'Admin User',
    email: 'admin@university.edu',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
];

const mockChats: Chat[] = [
  {
    id: 'chat-1',
    isGroup: false,
    members: [mockUsers[0], mockUsers[1]],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'chat-2',
    isGroup: false,
    members: [mockUsers[0], mockUsers[2]],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'chat-3',
    name: 'CS 101 Group',
    isGroup: true,
    members: [mockUsers[0], mockUsers[1], mockUsers[2]],
    createdAt: new Date().toISOString(),
  },
];

const mockMessages: Message[] = [
  {
    id: 'msg-1',
    content: 'Hello, how are you?',
    senderId: 'user-2',
    chatId: 'chat-1',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    sender: mockUsers[1],
  },
  {
    id: 'msg-2',
    content: 'I\'m good, thanks! How about you?',
    senderId: 'current-user-id',
    chatId: 'chat-1',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
    sender: mockUsers[0],
  },
  {
    id: 'msg-3',
    content: 'Can you send me the notes from yesterday\'s class?',
    senderId: 'user-2',
    chatId: 'chat-1',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    sender: mockUsers[1],
  },
  {
    id: 'msg-4',
    content: 'Hey, did you finish the assignment?',
    senderId: 'user-3',
    chatId: 'chat-2',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    sender: mockUsers[2],
  },
  {
    id: 'msg-5',
    content: 'Welcome everyone to CS 101!',
    senderId: 'user-2',
    chatId: 'chat-3',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    sender: mockUsers[1],
  },
];

// Update chats with last message
const chatsWithLastMessage = mockChats.map(chat => {
  const chatMessages = mockMessages.filter(msg => msg.chatId === chat.id);
  const lastMessage = chatMessages.length > 0 
    ? chatMessages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
    : undefined;
  
  return {
    ...chat,
    lastMessage
  };
});

export const useMessages = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>(chatsWithLastMessage);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (selectedChatId) {
      // Filter messages for selected chat
      const chatMessages = mockMessages.filter(msg => msg.chatId === selectedChatId);
      setMessages(chatMessages);
    } else {
      setMessages([]);
    }
  }, [selectedChatId]);

  const sendMessage = (content: string) => {
    if (!selectedChatId || !user) return;
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content,
      senderId: user.id,
      chatId: selectedChatId,
      createdAt: new Date().toISOString(),
      sender: user,
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Update last message in chat
    setChats(prev => 
      prev.map(chat => 
        chat.id === selectedChatId 
          ? { ...chat, lastMessage: newMessage }
          : chat
      )
    );
  };

  return {
    chats,
    messages,
    selectedChatId,
    selectChat: setSelectedChatId,
    sendMessage,
  };
};