import { LogOut, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  full_name: string | null;
  email: string | null;
}

interface UserMenuProps {
  userProfile: UserProfile | null;
  isLoading: boolean;
}

export function UserMenu({ userProfile, isLoading }: UserMenuProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      // First check if we have a valid session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session check error:', sessionError);
        // If there's no valid session, just redirect to auth
        navigate('/auth');
        return;
      }

      if (!session) {
        // No session found, redirect to auth
        navigate('/auth');
        return;
      }

      // If we have a valid session, try to sign out
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error.message);
        toast({
          variant: "destructive",
          title: "Error signing out",
          description: error.message
        });
        return;
      }

      // Clear any local storage items if needed
      localStorage.removeItem('supabase.auth.token');
      
      // Redirect to auth page
      navigate('/auth');
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account"
      });

    } catch (error) {
      console.error('Unexpected error during sign out:', error);
      // Force redirect to auth page in case of any unexpected errors
      navigate('/auth');
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    const nameParts = name.trim().split(' ');
    if (nameParts.length === 0) return 'U';
    
    const initials = nameParts
      .filter(part => part.length > 0)
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    
    return initials || 'U';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8 border border-gray-200">
            <AvatarFallback className="bg-rampup-primary/10 text-rampup-primary">
              {isLoading ? '...' : getInitials(userProfile?.full_name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {isLoading ? 'Loading...' : userProfile?.full_name || userProfile?.email?.split('@')[0] || 'User'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {isLoading ? '...' : userProfile?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}