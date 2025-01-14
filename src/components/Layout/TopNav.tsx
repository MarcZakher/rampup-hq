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
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        console.log('Current user:', user); // Debug log

        if (user) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('full_name, email')
            .eq('id', user.id)
            .single();
          
          console.log('Profile data:', profile); // Debug log
          console.log('Profile error:', error); // Debug log
          
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
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
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