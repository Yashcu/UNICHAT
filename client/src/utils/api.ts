import axios from 'axios';

// Vite exposes env variables on import.meta.env, but TypeScript may not know the type.
// Add a type assertion to fix the TS error.
const baseURL = ((import.meta as any).env?.VITE_API_URL || 'http://localhost:5000') + '/api/v1';

// Create a reusable Axios instance for the app
const api = axios.create({
  baseURL,
  withCredentials: true
});

// Add request interceptor to add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Authentication API calls
export const loginUser = (email: string, password: string) => 
  api.post('/users/login', { email, password });

export const registerUser = (name: string, email: string, password: string, role: string) => 
  api.post('/users/register', { name, email, password, role });

export const fetchUserProfile = () => 
  api.get('/users/profile');

export const logoutUser = () => 
  api.post('/users/logout');

// Circulars API calls
export const fetchCirculars = () => 
  api.get('/circulars');

export const createCircular = (circular: any) => // Use a more specific type if available
  api.post('/circulars', circular);

// Messaging API calls
export const fetchChats = () =>
  api.get('/chats');

export const fetchMessagesByChatId = (chatId: string, limit: number, skip: number) =>
  api.get(`/messages/${chatId}?limit=${limit}&skip=${skip}`);

export const sendMessageToChat = (content: string, chatId: string) =>
  api.post('/messages', { content, chatId });

export const reactToMessageApi = (messageId: string, emoji: string) =>
  api.patch(`/messages/${messageId}/reactions`, { emoji });

export const markMessageReadApi = (messageId: string) =>
  api.put('/messages/read', { messageId });
