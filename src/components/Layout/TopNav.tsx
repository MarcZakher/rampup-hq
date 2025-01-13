import { Bell, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function TopNav() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, email')
            .eq('id', user.id)
            .single();
          
          if (profile) {
            setUsername(profile.full_name || '');
            setEmail(profile.email || '');
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const getInitials = (name: string) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getDisplayInitial = () => {
    if (username) {
      return getInitials(username);
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return '?';
  };

  const handleLogout = async () => {
    try {
      localStorage.clear();
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        if (error.message?.includes('session_not_found')) {
          navigate('/login');
          return;
        }
        
        toast({
          variant: "destructive",
          title: "Error logging out",
          description: "Please try again"
        });
      }
      
      navigate('/login');
      
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login');
    }
  };

  return (
    <header className="border-b bg-white">
      <div className="flex h-16 items-center px-6 justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold bg-gradient-to-r from-rampup-primary to-rampup-tertiary bg-clip-text text-transparent">
            RampUP
          </h2>
        </div>
        <div className="flex items-center gap-4">
          {!isLoading && (username || email) && (
            <span className="text-sm text-gray-600">{username || email}</span>
          )}
          <Button variant="ghost" size="icon" className="text-rampup-primary hover:text-rampup-secondary hover:bg-rampup-light/10">
            <Bell className="h-5 w-5" />
          </Button>
          <Avatar className="h-8 w-8 bg-rampup-primary/10">
            <AvatarFallback className="text-rampup-primary text-sm">
              {isLoading ? '...' : getDisplayInitial()}
            </AvatarFallback>
          </Avatar>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="text-rampup-primary hover:text-rampup-secondary hover:bg-rampup-light/10">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}