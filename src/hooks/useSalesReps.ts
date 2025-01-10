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
      console.log('Loading sales reps for manager:', user.id);
      
      // First, get all sales reps managed by this user
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('manager_id', user.id)
        .eq('role', 'sales_rep');

      if (rolesError) {
        console.error('Error fetching sales rep roles:', rolesError);
        throw rolesError;
      }

      if (!userRoles?.length) {
        console.log('No sales reps found for manager:', user.id);
        setSalesReps([]);
        return;
      }

      const salesRepIds = userRoles.map(role => role.user_id);
      console.log('Found sales rep IDs:', salesRepIds);

      // Then get the profiles for these sales reps
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', salesRepIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      // Finally get all assessment scores for these sales reps
      const { data: scores, error: scoresError } = await supabase
        .from('assessment_scores')
        .select('*')
        .eq('manager_id', user.id)
        .in('sales_rep_id', salesRepIds);

      if (scoresError) {
        console.error('Error fetching scores:', scoresError);
        throw scoresError;
      }

      // Map the data to our expected format
      const mappedReps = profiles?.map(profile => {
        const repScores = scores?.filter(score => score.sales_rep_id === profile.id) || [];
        
        const getMonthScores = (month: string, length: number) => {
          const monthScores = new Array(length).fill(0);
          repScores
            .filter(score => score.month === month)
            .forEach(score => {
              monthScores[score.assessment_index] = Number(score.score);
            });
          return monthScores;
        };

        return {
          id: profile.id,
          name: profile.full_name || 'Unknown',
          month1: getMonthScores('month1', 5),
          month2: getMonthScores('month2', 6),
          month3: getMonthScores('month3', 6),
        };
      }) || [];

      console.log('Mapped sales reps:', mappedReps);
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
      const { error: deleteError } = await supabase.functions.invoke('delete-sales-rep', {
        body: { user_id: id }
      });

      if (deleteError) {
        console.error('Error deleting sales rep:', deleteError);
        throw deleteError;
      }

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
    if (user) {
      console.log('User changed, reloading sales reps');
      loadSalesReps();
    }
  }, [user]);

  return {
    salesReps,
    addSalesRep,
    removeSalesRep,
    loadSalesReps
  };
};