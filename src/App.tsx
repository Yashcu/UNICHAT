import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { Toaster } from 'react-hot-toast';

// Layouts
import AppLayout from './components/layout/AppLayout';
import AuthLayout from './components/auth/AuthLayout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MessagesPage from './pages/MessagesPage';
import CircularsPage from './pages/CircularsPage';
import NotificationsPage from './pages/NotificationsPage';
import AssistantPage from './pages/AssistantPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Auth routes */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>
          
          {/* Protected app routes */}
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="chats" element={<MessagesPage />} />
            <Route path="circulars" element={<CircularsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="assistant" element={<AssistantPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
          
          {/* Redirect to login if no route matches */}
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;