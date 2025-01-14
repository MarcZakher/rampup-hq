import { LogOut } from 'lucide-react';
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
      // Clear local storage first to ensure we remove any stale data
      localStorage.clear();
      
      try {
        // Attempt to sign out from Supabase
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error('Error during sign out:', error);
          // Even if there's an error, we'll continue with the navigation
          // since we've already cleared local storage
        }
      } catch (signOutError) {
        console.error('Unexpected error during sign out:', signOutError);
        // Continue with navigation even if sign out fails
      }

      // Always navigate to auth page
      navigate('/auth');
      
      // Show success message
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account."
      });
      
    } catch (error) {
      console.error('Critical error during sign out process:', error);
      // Ensure we still navigate to auth page even if something goes wrong
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