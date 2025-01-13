import { Bell, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

export function TopNav() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        if (error.message.includes('session_not_found')) {
          // Session already expired, just redirect to login
          navigate('/login');
          return;
        }
        throw error;
      }
      toast({
        title: "Logged out successfully",
        duration: 2000,
      });
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      // If we get here, there was an error but we should still redirect to login
      toast({
        title: "Session expired",
        description: "Please log in again",
        variant: "destructive",
        duration: 3000,
      });
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