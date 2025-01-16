import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from '@tanstack/react-query';

interface SalesRepFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function SalesRepForm({ onSuccess, onCancel }: SalesRepFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    password: '',
    managerId: '',
  });

  // Fetch managers
  const { data: managers } = useQuery({
    queryKey: ['managers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          manager_profile:profiles!user_id(
            id,
            full_name,
            email
          )
        `)
        .eq('role', 'manager');
      
      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.rpc('create_sales_rep', {
        email: formData.email,
        temp_password: formData.password,
        full_name: formData.fullName,
        manager_id: formData.managerId || null
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Sales rep created successfully",
      });
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          required
        />
      </div>
      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          value={formData.fullName}
          onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
          required
        />
      </div>
      <div>
        <Label htmlFor="password">Temporary Password</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
          required
        />
      </div>
      <div>
        <Label htmlFor="manager">Assign Manager</Label>
        <Select
          value={formData.managerId}
          onValueChange={(value) => setFormData(prev => ({ ...prev, managerId: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a manager" />
          </SelectTrigger>
          <SelectContent>
            {managers?.map((manager) => (
              <SelectItem 
                key={manager.manager_profile.id} 
                value={manager.manager_profile.id}
              >
                {manager.manager_profile.full_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Sales Rep"}
        </Button>
      </div>
    </form>
  );
}