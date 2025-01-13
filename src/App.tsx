import { BrowserRouter, useRoutes } from 'react-router-dom';
import { routes } from './config/routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * AppRoutes component that renders the application routes
 * Uses the routes configuration from config/routes.tsx
 */
function AppRoutes() {
  return useRoutes(routes);
}

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

/**
 * Main App component
 * Wraps the application with BrowserRouter and renders the routes
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;