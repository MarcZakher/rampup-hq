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

/**
 * Form component for adding new sales representatives
 * @param onAddSalesRep Callback function triggered when a new sales rep is added
 */
export function AddSalesRepForm({ onAddSalesRep }: AddSalesRepFormProps) {
  const [newRepName, setNewRepName] = useState('');
  const [newRepEmail, setNewRepEmail] = useState('');
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

    try {
      // Create the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newRepEmail,
        email_confirm: true,
        user_metadata: {
          full_name: newRepName,
          role: 'sales_rep'
        }
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('No user data returned');
      }

      // Create the user role with manager relationship
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: authData.user.id,
          role: 'sales_rep',
          manager_id: user?.id
        });

      if (roleError) throw roleError;

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
      <Input
        placeholder="Enter sales rep email"
        type="email"
        value={newRepEmail}
        onChange={(e) => setNewRepEmail(e.target.value)}
        className="w-64"
      />
      <Button onClick={handleSubmit}>
        <UserPlus className="mr-2 h-4 w-4" />
        Add Sales Rep
      </Button>
    </div>
  );
}