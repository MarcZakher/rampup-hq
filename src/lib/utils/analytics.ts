import { SalesRep } from '../types/analytics';
import { supabase } from '@/lib/supabase';

export const calculateAverage = (scores: number[]): number => {
  const validScores = scores.filter(score => score > 0);
  if (validScores.length === 0) return 0;
  return validScores.reduce((a, b) => a + b, 0) / validScores.length;
};

export const getSalesReps = async (userId: string, userRole?: string): Promise<SalesRep[]> => {
  try {
    // First get the sales reps based on role
    let salesRepsQuery = supabase
      .from('user_roles')
      .select('user_id, manager_id')
      .eq('role', 'sales_rep');

    if (userRole === 'manager') {
      // If manager, only get their direct reports
      salesRepsQuery = salesRepsQuery.eq('manager_id', userId);
    } else if (userRole === 'director') {
      // If director, get all sales reps under managers who report to them
      const { data: managerIds } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'manager')
        .eq('manager_id', userId);

      if (managerIds && managerIds.length > 0) {
        salesRepsQuery = salesRepsQuery.in('manager_id', managerIds.map(m => m.user_id));
      }
    }

    const { data: salesRepsData, error: salesRepsError } = await salesRepsQuery;

    if (salesRepsError) {
      console.error('Error fetching sales reps:', salesRepsError);
      return [];
    }

    // Get profiles for the sales reps
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name')
      .in('id', salesRepsData.map(rep => rep.user_id));

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      return [];
    }

    // Get assessment scores for these sales reps
    const { data: scores, error: scoresError } = await supabase
      .from('assessment_scores')
      .select('*')
      .in('sales_rep_id', salesRepsData.map(rep => rep.user_id));

    if (scoresError) {
      console.error('Error fetching scores:', scoresError);
      return [];
    }

    return salesRepsData.map(rep => {
      const profile = profiles?.find(p => p.id === rep.user_id);
      const repScores = {
        month1: new Array(5).fill(0),
        month2: new Array(6).fill(0),
        month3: new Array(6).fill(0),
      };

      scores?.forEach(score => {
        if (score.sales_rep_id === rep.user_id) {
          const month = score.month as keyof typeof repScores;
          if (repScores[month] && score.assessment_index < repScores[month].length) {
            repScores[month][score.assessment_index] = Number(score.score) || 0;
          }
        }
      });

      return {
        id: rep.user_id,
        name: profile?.full_name || 'Unknown',
        ...repScores
      };
    });
  } catch (error) {
    console.error('Error in getSalesReps:', error);
    return [];
  }
};