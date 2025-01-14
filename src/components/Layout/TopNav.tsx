import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserMenu } from './TopNav/UserMenu';
import { NotificationButton } from './TopNav/NotificationButton';

interface UserProfile {
  full_name: string | null;
  email: string | null;
}

export function TopNav() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        
        // First, ensure we have a valid session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          return;
        }

        if (!session) {
          console.log('No active session found');
          return;
        }

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('User fetch error:', userError);
          return;
        }

        if (!user) {
          console.log('No user found');
          return;
        }

        // Only proceed with profile fetch if we have a valid user
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', user.id)
          .single();
        
        if (profileError) {
          console.error('Profile fetch error:', profileError);
          return;
        }

        // Only update state if the component is still mounted
        if (mounted) {
          if (profile) {
            setUserProfile(profile);
          } else {
            // If no profile found, use the email as fallback
            setUserProfile({
              full_name: user.email?.split('@')[0] || 'User',
              email: user.email
            });
          }
        }
      } catch (error) {
        console.error('Error in fetchUserProfile:', error);
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