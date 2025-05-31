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
