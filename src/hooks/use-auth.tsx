import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseAuthReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
}

/**
 * Custom hook for handling authentication state and actions
 * @returns Authentication state and methods
 */
export function useAuth(): UseAuthReturn {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check initial session
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          setError(error.message);
          setIsAuthenticated(false);
          return;
        }
        
        setIsAuthenticated(!!session);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign out');
    }
  };

  return {
    isAuthenticated,
    isLoading,
    error,
    signOut
  };
}