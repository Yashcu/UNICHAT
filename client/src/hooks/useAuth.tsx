import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { loginUser, registerUser, fetchUserProfile, logoutUser } from '../utils/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const clearAuthError = () => setAuthError(null);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setUser(null);
          setIsLoading(false);
          return;
        }
        const { data } = await fetchUserProfile();
        setUser(data);
      } catch (error: { response?: { data?: { message?: string } }, message?: string }) {
        console.error('Auth check error:', error);
        localStorage.removeItem('token');
        setUser(null);
        setAuthError(error.message || 'Failed to fetch user profile.');
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setAuthError(null); // Clear previous errors
    try {
      const { data } = await loginUser(email, password);
      localStorage.setItem('token', data.token);
      setUser(data.user);
    } catch (error: { response?: { data?: { message?: string } }, message?: string }) {
      console.error('Login error:', error);
      setAuthError(error.response?.data?.message || error.message || 'Login failed. Please try again.');
      throw error; // Re-throw to allow components to handle
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    setAuthError(null); // Clear previous errors
    try {
      const { data } = await registerUser(name, email, password, role);
      localStorage.setItem('token', data.token);
      setUser(data.user);
    } catch (error: { response?: { data?: { message?: string } }, message?: string }) {
      console.error('Registration error:', error);
       setAuthError(error.response?.data?.message || error.message || 'Registration failed. Please try again.');
      throw error; // Re-throw to allow components to handle
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setAuthError(null); // Clear previous errors
    try {
      await logoutUser();
      localStorage.removeItem('token');
      setUser(null);
      // Consider using navigate instead of window.location.href for SPA
      window.location.href = '/auth/login'; 
    } catch (error: { response?: { data?: { message?: string } }, message?: string }) {
      console.error('Logout error:', error);
      // Even if the server request fails, clear local state
      localStorage.removeItem('token');
      setUser(null);
       setAuthError(error.message || 'Logout failed.');
      window.location.href = '/auth/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, authError, login, register, logout, clearAuthError }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
