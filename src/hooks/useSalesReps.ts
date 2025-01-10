import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { SalesRep } from '@/types/manager';

export const useSalesReps = () => {
  const [salesReps, setSalesReps] = useState<SalesRep[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const loadSalesReps = async () => {
    if (!user) return;

    try {
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('manager_id', user.id)
        .eq('role', 'sales_rep');

      if (rolesError) {
        console.error('Error fetching sales reps:', rolesError);
        toast({
          title: "Error",
          description: "Failed to load sales representatives",
          variant: "destructive"
        });
        return;
      }

      if (!userRoles?.length) {
        setSalesReps([]);
        return;
      }

      const savedReps = localStorage.getItem('manager_dashboard_sales_reps');
      const savedAssessments = savedReps ? JSON.parse(savedReps) : {};

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', userRoles.map(role => role.user_id));

      if (profilesError) {
        console.error('Error fetching user profiles:', profilesError);
        return;
      }

      const mappedReps = profiles?.map(profile => {
        const savedData = savedAssessments[profile.id] || {};
        return {
          id: profile.id,
          name: profile.full_name || 'Unknown',
          month1: savedData.month1 || new Array(5).fill(0),
          month2: savedData.month2 || new Array(6).fill(0),
          month3: savedData.month3 || new Array(6).fill(0),
        };
      }) || [];

      setSalesReps(mappedReps);
    } catch (error: any) {
      console.error('Error in loadSalesReps:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load sales representatives",
        variant: "destructive"
      });
    }
  };

  const addSalesRep = (newRep: SalesRep) => {
    setSalesReps(prevReps => [...prevReps, newRep]);
  };

  const removeSalesRep = async (id: number) => {
    try {
      // First delete the user role
      const { error: roleError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', id);

      if (roleError) {
        console.error('Error deleting user role:', roleError);
        toast({
          title: "Error",
          description: "Failed to remove sales representative role",
          variant: "destructive"
        });
        return;
      }

      // Then delete the profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (profileError) {
        console.error('Error deleting profile:', profileError);
        toast({
          title: "Error",
          description: "Failed to remove sales representative profile",
          variant: "destructive"
        });
        return;
      }

      // Remove from local storage
      const savedReps = localStorage.getItem('manager_dashboard_sales_reps') || '{}';
      const allSavedReps = JSON.parse(savedReps);
      delete allSavedReps[id];
      localStorage.setItem('manager_dashboard_sales_reps', JSON.stringify(allSavedReps));

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