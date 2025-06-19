import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; // Removed .tsx for consistency if resolver supports it, else keep .tsx
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { initializeTheme } from './hooks/useTheme'; // Import initializeTheme

// Initialize theme before rendering
initializeTheme();

// Create a client
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);
