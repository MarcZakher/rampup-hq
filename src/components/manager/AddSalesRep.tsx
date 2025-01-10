import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/context/auth-context';
import { AuthError } from '@supabase/supabase-js';

interface AddSalesRepProps {
  onSalesRepAdded: (newRep: any) => void;
}

export const AddSalesRep = ({ onSalesRepAdded }: AddSalesRepProps) => {
  const [newRepName, setNewRepName] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();

  const generateUniqueEmail = (name: string) => {
    const timestamp = Date.now();
    // Sanitize the name: remove special characters and convert to lowercase
    const sanitizedName = name.toLowerCase()
      .replace(/[^a-z0-9]/g, '.') // Replace special chars with dots
      .replace(/\.+/g, '.') // Replace multiple dots with single dot
      .replace(/^\.+|\.+$/g, ''); // Remove leading/trailing dots
    
    return `${sanitizedName}.${timestamp}@salesrep.example.com`;
  };

  const getErrorMessage = (error: AuthError) => {
    switch (error.message) {
      case 'User already registered':
        return 'A user with this email already exists. Please try again.';
      case 'Unable to validate email address: invalid format':
        return 'Invalid email format generated. Please try a different name.';
      default:
        return error.message;
    }
  };

  const addSalesRep = async () => {
    if (!newRepName.trim() || !user) {
      toast({
        title: "Error",
        description: "Please enter a name for the sales representative",
        variant: "destructive"
      });
      return;
    }

    try {
      const uniqueEmail = generateUniqueEmail(newRepName);
      
      const { data: newUser, error: createError } = await supabase.auth.signUp({
        email: uniqueEmail,
        password: 'tempPassword123',
        options: {
          data: {
            role: 'sales_rep',
            manager_id: user.id
          }
        }
      });

      if (createError) {
        toast({
          title: "Error",
          description: getErrorMessage(createError),
          variant: "destructive"
        });
        return;
      }

      if (!newUser.user) {
        toast({
          title: "Error",
          description: "Failed to create sales representative account",
          variant: "destructive"
        });
        return;
      }

      const newRep = {
        id: newUser.user.id,
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
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create sales representative",
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
      <Button onClick={addSalesRep}>
        <UserPlus className="mr-2 h-4 w-4" />
        Add Sales Rep
      </Button>
    </div>
  );
};