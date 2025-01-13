import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UseAuthRedirectProps {
  selectedRole: string;
  setError: (error: string) => void;
}

/**
 * Custom hook to handle authentication redirects based on user role
 * @param selectedRole - The selected role for the user
 * @param setError - Function to set error messages
 */
export function useAuthRedirect({ selectedRole, setError }: UseAuthRedirectProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.user_metadata?.role) {
        handleAuthRedirect(session.user.user_metadata.role);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        if (session?.user?.user_metadata?.role) {
          handleAuthRedirect(session.user.user_metadata.role);
        } else if (selectedRole) {
          try {
            const { data: { user }, error: updateError } = await supabase.auth.updateUser({
              data: { role: selectedRole }
            });
            
            if (updateError) {
              setError(updateError.message);
              return;
            }
            
            if (user?.user_metadata?.role) {
              handleAuthRedirect(user.user_metadata.role);
            }
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred during sign in';
            setError(errorMessage);
            toast({
              variant: "destructive",
              title: "Authentication Error",
              description: errorMessage
            });
          }
        } else {
          setError('Please select a role before signing in');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, selectedRole, setError, toast]);

  const handleAuthRedirect = (role: string) => {
    const roleRoutes = {
      director: '/director/dashboard',
      manager: '/manager/dashboard',
      sales_rep: '/sales-rep/dashboard',
      admin: '/admin/dashboard'
    };

    const route = roleRoutes[role as keyof typeof roleRoutes];
    if (route) {
      navigate(route);
    } else {
      setError('Invalid role assigned');
      toast({
        variant: "destructive",
        title: "Invalid Role",
        description: "The assigned role is not valid"
      });
    }
  };
}