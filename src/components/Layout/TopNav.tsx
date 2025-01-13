import { Bell, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export function TopNav() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      // First attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        // If it's a refresh token error, we can safely ignore it and proceed with cleanup
        if (!error.message?.includes('refresh_token_not_found')) {
          toast({
            variant: "destructive",
            title: "Error logging out",
            description: "Please try again"
          });
          return;
        }
      }
      
      // Clear any local storage data
      localStorage.clear();
      
      // Force a page reload to clear any stale state
      window.location.href = '/login';
      
    } catch (error) {
      console.error('Logout error:', error);
      // Force navigation to login even if there's an error
      window.location.href = '/login';
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
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-rampup-primary hover:text-rampup-secondary hover:bg-rampup-light/10"
          >
            <Bell className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-rampup-primary hover:text-rampup-secondary hover:bg-rampup-light/10"
          >
            <User className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleLogout} 
            className="text-rampup-primary hover:text-rampup-secondary hover:bg-rampup-light/10"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}