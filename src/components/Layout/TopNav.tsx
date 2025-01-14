import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserMenu } from './TopNav/UserMenu';
import { NotificationButton } from './TopNav/NotificationButton';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  full_name: string | null;
  email: string | null;
}

export function TopNav() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const fetchUserProfile = async () => {
      try {
        if (!mounted) return;
        setIsLoading(true);
        
        // First, ensure we have a valid session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          toast({
            variant: "destructive",
            title: "Session Error",
            description: "Failed to verify your session. Please try logging in again."
          });
          return;
        }

        if (!session) {
          console.log('No active session found');
          return;
        }

        // Get user data
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', session.user.id)
          .single();
        
        if (profileError) {
          console.error('Profile fetch error:', profileError);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load user profile"
          });
          return;
        }

        // Only update state if the component is still mounted
        if (mounted) {
          if (profile) {
            setUserProfile(profile);
          } else {
            // If no profile found, use the email as fallback
            setUserProfile({
              full_name: session.user.email?.split('@')[0] || 'User',
              email: session.user.email
            });
          }
        }
      } catch (error) {
        console.error('Error in fetchUserProfile:', error);
        if (mounted) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "An unexpected error occurred while loading your profile"
          });
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        fetchUserProfile();
      } else if (event === 'SIGNED_OUT') {
        setUserProfile(null);
      }
    });

    // Initial fetch
    fetchUserProfile();

    // Cleanup
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="border-b bg-white">
      <div className="flex h-16 items-center px-6 justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold bg-gradient-to-r from-rampup-primary to-rampup-tertiary bg-clip-text text-transparent">
            RampUP
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <NotificationButton />
          <UserMenu userProfile={userProfile} isLoading={isLoading} />
        </div>
      </div>
    </header>
  );
}