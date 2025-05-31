export type UserRole = 'student' | 'faculty' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profilePic?: string;
  createdAt: string;
  status?: string;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  chatId: string;
  createdAt: string;
  sender?: User;
  reactions?: Array<{ userId: string; emoji: string }>;
  readBy?: string[];
}

export interface Chat {
  id: string;
  name?: string;
  isGroup: boolean;
  members: User[];
  lastMessage?: Message;
  createdAt: string;
}

export interface Circular {
  id: string;
  title: string;
  content: string;
  summary?: string;
  postedBy: User;
  postedAt: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  createdBy: string;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  targetUserId?: string;
  targetRole?: UserRole;
  sentAt: string;
  isRead: boolean;
}