import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/context/auth-context';
import { SalesRep } from '@/types/manager';

interface AddSalesRepProps {
  onSalesRepAdded: (newRep: SalesRep) => void;
}

export const AddSalesRep = ({ onSalesRepAdded }: AddSalesRepProps) => {
  const [newRepName, setNewRepName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const addSalesRep = async () => {
    if (!newRepName.trim() || !user) {
      toast({
        title: "Error",
        description: "Please enter a name for the sales representative",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch(
        'https://cyqiqcpvbsgayzdglssx.supabase.co/functions/v1/create-sales-rep',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ name: newRepName }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create sales representative');
      }

      onSalesRepAdded({
        id: Number(data.user.id),
        name: newRepName,
        month1: new Array(5).fill(0),
        month2: new Array(6).fill(0),
        month3: new Array(6).fill(0)
      });

      setNewRepName('');
      toast({
        title: "Success",
        description: "Sales representative added successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create sales representative",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-4 items-center">
      <Input
        placeholder="Enter sales rep name"
        value={newRepName}
        onChange={(e) => setNewRepName(e.target.value)}
        className="w-64"
      />
      <Button onClick={addSalesRep} disabled={isLoading}>
        <UserPlus className="mr-2 h-4 w-4" />
        {isLoading ? 'Adding...' : 'Add Sales Rep'}
      </Button>
    </div>
  );
};