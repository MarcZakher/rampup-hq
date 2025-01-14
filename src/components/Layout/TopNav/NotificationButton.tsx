import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NotificationButton() {
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="text-rampup-primary hover:text-rampup-secondary hover:bg-rampup-light/10"
    >
      <Bell className="h-5 w-5" />
    </Button>
  );
}