import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute component that handles authentication state and protected route access
 * @param children - The child components to render when authenticated
 * @returns The protected route component or redirects to login
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    // Check initial session
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error && mounted) {
          console.error('Session check error:', error);
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "Failed to verify your session. Please try logging in again."
          });
          setIsAuthenticated(false);
          return;
        }
        
        if (mounted) {
          setIsAuthenticated(!!session);
        }
      } catch (error) {
        console.error('Session check error:', error);
        if (mounted) {
          setIsAuthenticated(false);
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "An unexpected error occurred. Please try logging in again."
          });
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_IN') {
        setIsAuthenticated(true);
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in."
        });
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        toast({
          title: "Signed out",
          description: "You have been signed out successfully."
        });
      } else if (event === 'TOKEN_REFRESHED') {
        setIsAuthenticated(!!session);
      }
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rampup-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}