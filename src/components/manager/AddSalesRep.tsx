import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/context/auth-context';

interface AddSalesRepProps {
  onSalesRepAdded: (newRep: any) => void;
}

export const AddSalesRep = ({ onSalesRepAdded }: AddSalesRepProps) => {
  const [newRepName, setNewRepName] = useState('');
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

    const { data: newUser, error: createError } = await supabase.auth.signUp({
      email: `${newRepName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      password: 'tempPassword123',
      options: {
        data: {
          role: 'sales_rep',
          manager_id: user.id
        }
      }
    });

    if (createError || !newUser.user) {
      toast({
        title: "Error",
        description: "Failed to create sales representative account",
        variant: "destructive"
      });
      return;
    }

    const newRep = {
      id: parseInt(newUser.user.id),
      name: newRepName,
      month1: new Array(5).fill(0),
      month2: new Array(6).fill(0),
      month3: new Array(6).fill(0)
    };

    onSalesRepAdded(newRep);
    setNewRepName('');
    toast({
      title: "Success",
      description: "Sales representative added successfully"
    });
  };

  return (
    <div className="flex gap-4 items-center">
      <Input
        placeholder="Enter sales rep name"
        value={newRepName}
        onChange={(e) => setNewRepName(e.target.value)}
        className="w-64"
      />
      <Button onClick={addSalesRep}>
        <UserPlus className="mr-2 h-4 w-4" />
        Add Sales Rep
      </Button>
    </div>
  );
};