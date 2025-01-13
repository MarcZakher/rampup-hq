import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddSalesRepFormProps {
  onAddSalesRep: (name: string) => void;
}

/**
 * Form component for adding new sales representatives
 * @param onAddSalesRep Callback function triggered when a new sales rep is added
 */
export function AddSalesRepForm({ onAddSalesRep }: AddSalesRepFormProps) {
  const [newRepName, setNewRepName] = useState('');
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!newRepName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for the sales representative",
        variant: "destructive"
      });
      return;
    }

    onAddSalesRep(newRepName);
    setNewRepName('');
  };

  return (
    <div className="flex gap-4 items-center">
      <Input
        placeholder="Enter sales rep name"
        value={newRepName}
        onChange={(e) => setNewRepName(e.target.value)}
        className="w-64"
      />
      <Button onClick={handleSubmit}>
        <UserPlus className="mr-2 h-4 w-4" />
        Add Sales Rep
      </Button>
    </div>
  );
}