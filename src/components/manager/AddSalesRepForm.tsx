import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

interface AddSalesRepFormProps {
  onAddSalesRep: (name: string) => void;
}

export function AddSalesRepForm({ onAddSalesRep }: AddSalesRepFormProps) {
  const [newRepName, setNewRepName] = useState('');
  const [newRepEmail, setNewRepEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!newRepName.trim() || !newRepEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter both name and email for the sales representative",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('create-sales-rep', {
        body: {
          email: newRepEmail,
          fullName: newRepName,
          managerId: user?.id
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Sales representative added successfully"
      });

      onAddSalesRep(newRepName);
      setNewRepName('');
      setNewRepEmail('');
    } catch (error: any) {
      console.error('Error adding sales rep:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add sales representative",
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
        disabled={isLoading}
      />
      <Input
        placeholder="Enter sales rep email"
        type="email"
        value={newRepEmail}
        onChange={(e) => setNewRepEmail(e.target.value)}
        className="w-64"
        disabled={isLoading}
      />
      <Button onClick={handleSubmit} disabled={isLoading}>
        <UserPlus className="mr-2 h-4 w-4" />
        {isLoading ? 'Adding...' : 'Add Sales Rep'}
      </Button>
    </div>
  );
}