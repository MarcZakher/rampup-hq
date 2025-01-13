import { Bell, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function TopNav() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      // First check if we have a session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session check error:', sessionError);
        navigate('/login');
        return;
      }

      if (!session) {
        // No active session, just redirect to login
        navigate('/login');
        return;
      }

      // We have a valid session, attempt to sign out
      const { error: signOutError } = await supabase.auth.signOut({
        scope: 'global' // Sign out from all tabs/windows
      });
      
      if (signOutError) {
        console.error('Sign out error:', signOutError);
        toast({
          variant: "destructive",
          title: "Error during logout",
          description: signOutError.message
        });
      } else {
        toast({
          title: "Logged out successfully",
          description: "You have been signed out of your account"
        });
      }
      
      // Always navigate to login page
      navigate('/login');
      
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login');
      toast({
        variant: "destructive",
        title: "Error during logout",
        description: "You have been redirected to the login page"
      });
    }
  };

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
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
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-rampup-primary hover:text-rampup-secondary hover:bg-rampup-light/10"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative h-10 w-10 rounded-full"
                aria-label="User profile"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-rampup-primary/10 text-rampup-primary">
                    {user?.user_metadata?.full_name ? 
                      getInitials(user.user_metadata.full_name) : 
                      user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.user_metadata?.full_name || 'User'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
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