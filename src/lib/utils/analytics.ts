import { SalesRep } from '../types/analytics';
import { supabase } from '@/integrations/supabase/client';

export const calculateAverage = (scores: number[]): number => {
  const validScores = scores.filter(score => score > 0);
  if (validScores.length === 0) return 0;
  return validScores.reduce((a, b) => a + b, 0) / validScores.length;
};

export const getSalesReps = async (userId: string, userRole?: string): Promise<SalesRep[]> => {
  try {
    let query = supabase
      .from('user_roles')
      .select(`
        user_id,
        profiles:user_id(id, full_name)
      `);

    // If user is a manager, only get their sales reps
    if (userRole === 'manager') {
      query = query.eq('manager_id', userId).eq('role', 'sales_rep');
    } else if (userRole === 'director') {
      // For directors, get all sales reps under their managers
      const { data: managerIds } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('manager_id', userId)
        .eq('role', 'manager');

      if (managerIds && managerIds.length > 0) {
        query = query
          .eq('role', 'sales_rep')
          .in('manager_id', managerIds.map(m => m.user_id));
      }
    }

    const { data: salesRepsData, error: salesRepsError } = await query;

    if (salesRepsError) {
      console.error('Error fetching sales reps:', salesRepsError);
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
        id: rep.profiles?.id || rep.user_id,
        name: rep.profiles?.full_name || 'Unknown',
        month1: repScores.month1,
        month2: repScores.month2,
        month3: repScores.month3,
      };
    });
  } catch (error) {
    console.error('Error in getSalesReps:', error);
    return [];
  }
};