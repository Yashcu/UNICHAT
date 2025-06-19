import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Message, Chat, Attachment, User } from '../../types'; // Added Attachment, User
import { Send, PaperclipIcon, Info, MessageSquare } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import UserAvatar from '../shared/UserAvatar';
import MessageItem from './MessageItem';

interface ChatWindowProps {
  chat: Chat | null;
  messages: Message[];
  onSendMessage: (content: string, attachments?: Attachment[]) => void; // Updated signature
  reactToMessage: (messageId: string, emoji: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = React.memo(({ 
  chat, 
  messages, 
  onSendMessage, 
  reactToMessage
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [debouncedMessage, setDebouncedMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [attachmentPreviews, setAttachmentPreviews] = useState<{url?: string, name: string, type: string}[]>([]);

  const Row = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const message = messages[index];
      return (
        <div style={style} key={message.id}>
          <MessageItem
            message={message}
            currentUser={user as User | null} // Cast user from useAuth if its type is too broad
            reactToMessage={reactToMessage}
          />
        </div>
      );
    },
    [messages, user, reactToMessage]
  );

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedMessage(newMessage), 200);
    return () => clearTimeout(handler);
  }, [newMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debouncedMessage.trim() || attachments.length > 0) {
      const formattedAttachments: Attachment[] = attachments.map((file, index) => {
        const previewInfo = attachmentPreviews[index]; // Assumes 1:1 mapping by index
        return {
          fileName: file.name,
          fileType: file.type,
          size: file.size,
          // Client-side preview URL for display before upload in MessageItem
          previewURL: previewInfo?.type?.startsWith('image/') ? previewInfo.url : undefined,
        };
      });
      onSendMessage(debouncedMessage, formattedAttachments);
      setNewMessage('');
      setAttachments([]);
      setAttachmentPreviews([]);
    }
  };

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    // Append new files to existing ones
    const currentNewAttachments = [...attachments, ...files];
    setAttachments(currentNewAttachments);

    const newPreviewsPromises = files.map(file => {
      return new Promise<{url?: string, name: string, type: string}>(resolve => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({ url: reader.result as string, name: file.name, type: file.type });
          };
          reader.readAsDataURL(file);
        } else {
          resolve({ name: file.name, type: file.type }); // No URL for non-images
        }
      });
    });

    Promise.all(newPreviewsPromises).then(newPreviewData => {
      setAttachmentPreviews(prev => [...prev, ...newPreviewData]);
    });

    if (event.target) {
      event.target.value = ''; // Clear the input value
    }
  };

  const removeAttachment = (indexToRemove: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== indexToRemove));
    setAttachmentPreviews(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (!chat) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50 dark:bg-gray-800 p-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-300 mb-4">
            <MessageSquare size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Your messages</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            Select a conversation or start a new one to begin messaging
          </p>
        </div>
      </div>
    );
  }

  const otherUser = chat.isGroup
    ? null
    : chat.members.find((m) => m.id !== user?.id);

  const chatName = chat.isGroup ? chat.name : otherUser?.name || "Unknown User";
  const chatAvatarUser = chat.isGroup
    ? { name: chat.name || "Group" }
    : otherUser
      ? { name: otherUser.name, profilePic: otherUser.profilePic, status: otherUser.status }
      : { name: "Unknown User" };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      <div className="px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center">
        <UserAvatar user={chatAvatarUser} size="h-10 w-10" />
        <div className="flex-1 min-w-0 ml-3">
          <h2 className="text-base font-medium text-gray-900 dark:text-gray-100 truncate">
            {chatName}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
            {chat.isGroup
              ? `${chat.members.length} members`
              : otherUser?.status || "Offline"
            }
          </p>
        </div>
        <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
          <Info size={20} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
        {messages.length > 0 ? (
          <List
            height={400}
            itemCount={messages.length}
            itemSize={72} // Approximate item size, adjust as needed
            width={"100%"}
          >
            {Row}
          </List>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 dark:text-gray-400">No messages yet. Start the conversation!</p>
          </div>
        )}
      </div>

      {attachmentPreviews.length > 0 && (
        <div className="p-2 flex flex-wrap gap-2 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
          {attachmentPreviews.map((previewInfo, index) => (
            <div key={index} className="relative group w-20 h-20">
              {previewInfo.url && previewInfo.type.startsWith('image/') ? (
                <img src={previewInfo.url} alt={previewInfo.name} className="w-full h-full object-cover rounded-md" />
              ) : (
                <div className="w-full h-full bg-gray-200 dark:bg-gray-600 rounded-md flex flex-col items-center justify-center p-1 text-center">
                  <span className="text-xs text-gray-600 dark:text-gray-300 truncate block w-full">{previewInfo.name}</span>
                  <span className="text-xxs text-gray-400 dark:text-gray-500">{previewInfo.type}</span>
                </div>
              )}
              <button
                onClick={() => removeAttachment(index)}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs opacity-75 group-hover:opacity-100 transition-opacity"
                aria-label="Remove attachment"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleFileSelection}
            className="hidden"
            accept="image/*,application/pdf,.doc,.docx,.txt,.zip,.rar"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mr-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Attach files"
          >
            <PaperclipIcon size={20} />
          </button>
          <input
            type="text"
            placeholder={attachments.length > 0 ? "Add a caption..." : "Type a message..."}
            className="flex-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            type="submit"
            disabled={!debouncedMessage.trim() && attachments.length === 0}
            className="ml-2 bg-primary-500 text-white rounded-full p-2 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
});

export default ChatWindow;
