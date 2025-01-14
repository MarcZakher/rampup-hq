import { BrowserRouter, useRoutes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { routes } from './routes';
import { useEffect } from 'react';
import { supabase } from './integrations/supabase/client';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function AppRoutes() {
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session); // Debug log
      if (event === 'SIGNED_OUT') {
        // Clear any auth state
        localStorage.removeItem('supabase.auth.token');
        queryClient.clear();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return useRoutes(routes);
}

function App() {
  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('Session check:', session, error); // Debug log
        
        if (error || !session) {
          console.error('Session error or no session:', error);
          // Clear any invalid session data
          await supabase.auth.signOut();
          localStorage.removeItem('supabase.auth.token');
          queryClient.clear();
        }
      } catch (err) {
        console.error('Error checking session:', err);
        // Clear any invalid session data on error
        await supabase.auth.signOut();
        localStorage.removeItem('supabase.auth.token');
        queryClient.clear();
      }
    };

    checkSession();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;