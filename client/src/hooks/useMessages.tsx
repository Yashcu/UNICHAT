import { useState, useEffect, useCallback } from 'react';
import { Chat, Message, User } from '../types'; // Import User type
import { useAuth } from './useAuth';
import {
  fetchChats as fetchChatsApi, // Alias to avoid name conflict
  fetchMessagesByChatId,
  sendMessageToChat,
  reactToMessageApi,
  markMessageReadApi
} from '../utils/api';

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
  const [loadingChats, setLoadingChats] = useState(false); // New loading state
  const [loadingMessages, setLoadingMessages] = useState(false); // Existing loading state renamed
  const [sendingMessage, setSendingMessage] = useState(false); // New loading state
  const [chatsError, setChatsError] = useState<string | null>(null); // New error state
  const [messagesError, setMessagesError] = useState<string | null>(null); // New error state
  const [sendMessageError, setSendMessageError] = useState<string | null>(null); // New error state

  const PAGE_SIZE = 30;

  // Fetch chats on mount
  useEffect(() => {
    const getChats = async () => {
      setLoadingChats(true);
      setChatsError(null);
      try {
        const { data } = await fetchChatsApi();
        setChats(data);
      } catch (error: any) {
        setChatsError(error.message || 'Failed to fetch chats.');
        setChats([]);
      } finally {
        setLoadingChats(false);
      }
    };
    getChats();
  }, []);

  // Fetch messages for selected chat (paginated)
  useEffect(() => {
    if (!selectedChatId) {
      setMessages([]);
      setHasMore(true);
      setMessagesError(null);
      return;
    }
    const getMessages = async () => {
      setLoadingMessages(true);
      setMessagesError(null);
      try {
        const { data } = await fetchMessagesByChatId(selectedChatId, PAGE_SIZE, 0);
        setMessages(data);
        setHasMore(data.length === PAGE_SIZE);
      } catch (error: any) {
        setMessagesError(error.message || 'Failed to fetch messages.');
        setMessages([]);
        setHasMore(false);
      } finally {
        setLoadingMessages(false);
      }
    };
    getMessages();
  }, [selectedChatId]);

  // Fetch more messages (for infinite scroll)
  const fetchMoreMessages = useCallback(async () => {
    if (!selectedChatId || loadingMessages || !hasMore) return;
    setLoadingMessages(true);
    try {
      const { data } = await fetchMessagesByChatId(selectedChatId, PAGE_SIZE, messages.length);
      setMessages(prev => [...prev, ...data]);
      setHasMore(data.length === PAGE_SIZE);
    } catch (error: any) {
       setMessagesError(error.message || 'Failed to fetch more messages.');
      setHasMore(false);
    } finally {
      setLoadingMessages(false);
    }
  }, [selectedChatId, loadingMessages, hasMore, messages.length]); // Added messages.length to dependency array

  /**
   * Send a message to the selected chat
   * @param content The message content
   */
  const sendMessage = async (content: string) => {
    if (!selectedChatId || !user || sendingMessage) return;
    setSendingMessage(true);
    setSendMessageError(null);
    try {
      const { data } = await sendMessageToChat(content, selectedChatId);
      // Optimistically update messages list
      const newMessage: Message = {
        ...data, // Assuming backend returns full message
        sender: user, // Add current user details
        createdAt: new Date().toISOString(), // Add timestamp
        chatId: selectedChatId,
      };
       // Prepend for consistency with potential real-time updates
      setMessages(prev => [newMessage, ...prev]); 

      // Optionally update last message in chat list
      setChats(prev => prev.map(chat => 
        chat.id === selectedChatId 
          ? { ...chat, lastMessage: newMessage } 
          : chat
      ));
       setSendingMessage(false);
    } catch (error: any) {
      setSendMessageError(error.message || 'Failed to send message.');
      setSendingMessage(false);
      throw error; // Re-throw to allow components to handle
    }
  };

  // Add or remove a reaction to a message
  const reactToMessage = async (messageId: string, emoji: string) => {
    try {
      const { data } = await reactToMessageApi(messageId, emoji);
      // Update the specific message with new reactions
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, reactions: data.reactions } : m));
    } catch (error) {
      console.error('Failed to react to message:', error);
      // Optionally handle error state for reactions
    }
  };

  // Mark a message as read
  const markMessageRead = async (messageId: string) => {
     // Avoid marking as read if already read by current user (basic check)
     const messageToMark = messages.find(m => m.id === messageId);
     if (messageToMark?.readBy?.includes(user?.id || '')) return; // Basic check

    try {
      const { data } = await markMessageReadApi(messageId);
      // Update the specific message with new readBy list
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, readBy: data.readBy } : m));
    } catch (error) {
       console.error('Failed to mark message as read:', error);
       // Optionally handle error state for marking as read
    }
  };

  return {
    chats,
    messages,
    hasMore,
    loadingChats,
    loadingMessages,
    sendingMessage,
    chatsError,
    messagesError,
    sendMessageError,
    selectedChatId,
    selectChat: setSelectedChatId,
    sendMessage,
    fetchMoreMessages,
    reactToMessage,
    markMessageRead,
  };
};
