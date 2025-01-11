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
      // First clear the session from local storage
      localStorage.removeItem('supabase.auth.token');
      
      // Attempt to sign out from Supabase
      await supabase.auth.signOut();
      
      // Always navigate to login page
      navigate('/login', { replace: true });
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account"
      });
    } catch (error) {
      console.error('Error during logout:', error);
      
      // Even if there's an error, redirect to login
      navigate('/login', { replace: true });
      
      toast({
        variant: "destructive",
        title: "Error logging out",
        description: "An unexpected error occurred while logging out"
      });
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
          <Button variant="ghost" size="icon" className="text-rampup-primary hover:text-rampup-secondary hover:bg-rampup-light/10">
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