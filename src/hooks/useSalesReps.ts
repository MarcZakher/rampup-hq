import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { SalesRep } from '@/types/manager';
import { getSalesReps } from '@/lib/utils/analytics';

export const useSalesReps = () => {
  const [salesReps, setSalesReps] = useState<SalesRep[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const loadSalesReps = async () => {
    if (!user) return;

    try {
      // First get the user's role
      const { data: userRole, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (roleError) {
        console.error('Error fetching user role:', roleError);
        return;
      }

      const reps = await getSalesReps(user.id, userRole.role);
      setSalesReps(reps);
    } catch (error: any) {
      console.error('Error in loadSalesReps:', error);
      toast({
        title: "Error",
        description: "Failed to load sales representatives",
        variant: "destructive"
      });
    }
  };

  const addSalesRep = (newRep: SalesRep) => {
    setSalesReps(prevReps => [...prevReps, newRep]);
  };

  const removeSalesRep = async (id: number) => {
    try {
      // First delete the user from auth.users using our Edge Function
      const { error: deleteError } = await supabase.functions.invoke('delete-sales-rep', {
        body: { user_id: id }
      });

      if (deleteError) {
        console.error('Error deleting user:', deleteError);
        toast({
          title: "Error",
          description: "Failed to remove sales representative",
          variant: "destructive"
        });
        return;
      }

      // Update state
      setSalesReps(prevReps => prevReps.filter(rep => rep.id !== id));
      
      toast({
        title: "Success",
        description: "Sales representative removed successfully"
      });
    } catch (error: any) {
      console.error('Error in removeSalesRep:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove sales representative",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadSalesReps();
  }, [user]);

  return {
    salesReps,
    addSalesRep,
    removeSalesRep,
    loadSalesReps
  };
};