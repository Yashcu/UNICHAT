import { useState } from 'react'; // Removed useEffect, useCallback
import { Chat, Message } from '../types';
import { useAuth } from './useAuth';
import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import {
  fetchChats as fetchChatsApi,
  fetchMessagesByChatId,
  sendMessageToChat,
  reactToMessageApi,
  markMessageReadApi
} from '../utils/api';

export const useMessages = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const PAGE_SIZE = 30;

  // Chat Fetching
  const { data: chatsData, isLoading: loadingChats, error: chatsError } = useQuery<{ data: Chat[] }, Error>({
    queryKey: ['chats'],
    queryFn: fetchChatsApi,
  });
  const chats = chatsData?.data || [];

  // Message Fetching (Infinite Scroll)
  const {
    data: messagesData,
    fetchNextPage,
    hasNextPage,
    isLoading: loadingMessages,
    error: messagesError,
    // refetch: refetchMessages // Available if needed
  } = useInfiniteQuery<{ data: Message[] }, Error>({
    queryKey: ['messages', selectedChatId],
    queryFn: ({ pageParam = 0 }) => fetchMessagesByChatId(selectedChatId!, PAGE_SIZE, pageParam * PAGE_SIZE),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.data.length === PAGE_SIZE ? allPages.length : undefined;
    },
    enabled: !!selectedChatId,
  });
  const messages = messagesData?.pages.flatMap(page => page.data) || [];

  // Send Message Mutation
  const { mutate: sendMessageMutate, isLoading: sendingMessage, error: sendMessageError } = useMutation<{ data: Message }, Error, { content: string; chatId: string }>({
    mutationFn: ({ content, chatId }) => sendMessageToChat(content, chatId),
    onSuccess: (response, variables) => { // Changed 'data' to 'response' to avoid conflict
      queryClient.invalidateQueries({ queryKey: ['messages', variables.chatId] });
      queryClient.setQueryData(['chats'], (oldData: { data: Chat[] } | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: oldData.data.map(chat =>
            chat.id === variables.chatId ? { ...chat, lastMessage: response.data } : chat
          ),
        };
      });
    },
  });
  const sendMessage = (content: string) => {
    if (!selectedChatId) return;
    sendMessageMutate({ content, chatId: selectedChatId });
  };

  // React to Message Mutation
  const { mutate: reactToMessageMutate } = useMutation<{ data: { reactions: any[] } }, Error, { messageId: string; emoji: string }>({
    mutationFn: ({ messageId, emoji }) => reactToMessageApi(messageId, emoji),
    onSuccess: (response, variables) => { // Changed 'data' to 'response'
      // More targeted update for reactions:
      queryClient.setQueryData(['messages', selectedChatId], (oldMessagesData: any) => {
        if (!oldMessagesData) return oldMessagesData;
        return {
          ...oldMessagesData,
          pages: oldMessagesData.pages.map((page: any) => ({
            ...page,
            data: page.data.map((message: Message) =>
              message.id === variables.messageId ? { ...message, reactions: response.data.reactions } : message
            ),
          })),
        };
      });
      // Fallback to invalidate if specific update is complex
      // queryClient.invalidateQueries({ queryKey: ['messages', selectedChatId] });
    },
  });
  const reactToMessage = (messageId: string, emoji: string) => reactToMessageMutate({ messageId, emoji });

  // Mark Message Read Mutation
  const { mutate: markMessageReadMutate } = useMutation<{ data: { readBy: string[] } }, Error, string>({
    mutationFn: (messageId: string) => markMessageReadApi(messageId),
    onSuccess: (response, messageId) => { // Changed 'data' to 'response', 'variables' to 'messageId'
       queryClient.setQueryData(['messages', selectedChatId], (oldMessagesData: any) => {
        if (!oldMessagesData) return oldMessagesData;
        return {
          ...oldMessagesData,
          pages: oldMessagesData.pages.map((page: any) => ({
            ...page,
            data: page.data.map((message: Message) =>
              message.id === messageId ? { ...message, readBy: response.data.readBy } : message
            ),
          })),
        };
      });
      // queryClient.invalidateQueries({ queryKey: ['messages', selectedChatId] });
    },
  });
  const markMessageRead = (messageId: string) => {
    const messageToMark = messages.find(m => m.id === messageId);
    if (messageToMark?.readBy?.includes(user?.id || '')) return;
    markMessageReadMutate(messageId);
  };

  return {
    chats,
    messages,
    selectedChatId,
    selectChat: setSelectedChatId,

    loadingChats,
    chatsError: chatsError as Error | null, // Cast error for consistent return type

    loadingMessages,
    messagesError: messagesError as Error | null, // Cast error
    fetchNextPage,
    hasNextPage,

    sendMessage,
    sendingMessage,
    sendMessageError: sendMessageError as Error | null, // Cast error

    reactToMessage,
    // reactToMessageError, // Can be added if error state is needed for this mutation

    markMessageRead,
    // markMessageReadError, // Can be added if error state is needed
  };
};
