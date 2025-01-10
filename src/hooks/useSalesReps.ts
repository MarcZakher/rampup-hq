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
      // First get all sales reps under this manager
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

      // Get the profiles for these sales reps
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', userRoles.map(role => role.user_id));

      if (profilesError) {
        console.error('Error fetching user profiles:', profilesError);
        return;
      }

      // Get all assessment scores for these sales reps
      const { data: scores, error: scoresError } = await supabase
        .from('assessment_scores')
        .select('*')
        .eq('manager_id', user.id)
        .in('sales_rep_id', userRoles.map(role => role.user_id));

      if (scoresError) {
        console.error('Error fetching assessment scores:', scoresError);
        return;
      }

      // Map the profiles to our SalesRep type, including their scores
      const mappedReps = profiles?.map(profile => {
        // Initialize empty score arrays
        const repScores = {
          month1: new Array(5).fill(0),
          month2: new Array(6).fill(0),
          month3: new Array(6).fill(0),
        };

        // Fill in the actual scores from the database
        scores?.forEach(score => {
          if (score.sales_rep_id === profile.id) {
            const month = score.month as keyof typeof repScores;
            if (repScores[month] && score.assessment_index < repScores[month].length) {
              repScores[month][score.assessment_index] = Number(score.score) || 0;
            }
          }
        });

        return {
          id: profile.id,
          name: profile.full_name || 'Unknown',
          month1: repScores.month1,
          month2: repScores.month2,
          month3: repScores.month3,
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