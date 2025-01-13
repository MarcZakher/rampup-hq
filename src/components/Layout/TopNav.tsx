import { Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TopNav() {
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
        </div>
      </div>
    </header>
  );
}