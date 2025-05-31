import { useState, useEffect } from 'react';
import { Chat, Message } from '../types';
import { useAuth } from './useAuth';
import api from '../utils/api';

/**
 * useMessages hook: fetches chats and messages from the API, manages selected chat and sending messages
 * - Fetches all chats for the current user on mount
 * - Fetches messages for the selected chat
 * - Allows sending a message to the selected chat
 */
export const useMessages = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const PAGE_SIZE = 30;

  // Fetch chats on mount
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data } = await api.get('/chats');
        setChats(data);
      } catch (error) {
        setChats([]);
      }
    };
    fetchChats();
  }, []);

  // Fetch messages for selected chat (paginated)
  useEffect(() => {
    if (!selectedChatId) {
      setMessages([]);
      setHasMore(true);
      return;
    }
    const fetchMessages = async () => {
      try {
        const { data } = await api.get(`/messages/${selectedChatId}?limit=${PAGE_SIZE}&skip=0`);
        setMessages(data);
        setHasMore(data.length === PAGE_SIZE);
      } catch (error) {
        setMessages([]);
        setHasMore(false);
      }
    };
    fetchMessages();
  }, [selectedChatId]);

  // Fetch more messages (for infinite scroll)
  const fetchMoreMessages = async () => {
    if (!selectedChatId || loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const { data } = await api.get(`/messages/${selectedChatId}?limit=${PAGE_SIZE}&skip=${messages.length}`);
      setMessages(prev => [...prev, ...data]);
      setHasMore(data.length === PAGE_SIZE);
    } catch (error) {
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  /**
   * Send a message to the selected chat
   * @param content The message content
   */
  const sendMessage = async (content: string) => {
    if (!selectedChatId || !user) return;
    try {
      // The backend expects chatId in the body for POST /messages
      const { data } = await api.post('/messages', { content, chatId: selectedChatId });
      setMessages(prev => [data, ...prev]); // Prepend for consistency with pagination
      // Optionally update last message in chat
      setChats(prev => prev.map(chat => chat.id === selectedChatId ? { ...chat, lastMessage: data } : chat));
    } catch (error) {
      // Optionally handle error
    }
  };

  // Add or remove a reaction to a message
  const reactToMessage = async (messageId: string, emoji: string) => {
    try {
      const { data } = await api.patch(`/messages/${messageId}/reactions`, { emoji });
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, reactions: data.reactions } : m));
    } catch (error) {
      // Optionally handle error
    }
  };

  // Mark a message as read
  const markMessageRead = async (messageId: string) => {
    try {
      const { data } = await api.put('/messages/read', { messageId });
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, readBy: data.readBy } : m));
    } catch (error) {
      // Optionally handle error
    }
  };

  return {
    chats,
    messages,
    hasMore,
    loadingMore,
    selectedChatId,
    selectChat: setSelectedChatId,
    sendMessage,
    fetchMoreMessages,
    reactToMessage,
    markMessageRead,
  };
};