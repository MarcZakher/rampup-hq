import { Bell, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TopNav() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .single();
          
          if (error) {
            console.error('Error fetching profile:', error);
            return;
          }
          
          if (profile?.full_name) {
            setUserName(profile.full_name);
          } else {
            setUserName(user.email || 'User');
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUserProfile();
  }, []);

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
          <Button variant="ghost" size="icon" className="text-rampup-primary hover:text-rampup-secondary hover:bg-rampup-light/10">
            <Bell className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-rampup-primary hover:text-rampup-secondary hover:bg-rampup-light/10">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{userName || 'Loading...'}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}