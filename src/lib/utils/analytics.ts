import { SalesRep } from '../types/analytics';
import { supabase } from '@/lib/supabase';

export const calculateAverage = (scores: number[]): number => {
  const validScores = scores.filter(score => score > 0);
  if (validScores.length === 0) return 0;
  return validScores.reduce((a, b) => a + b, 0) / validScores.length;
};

export const getSalesReps = async (userId: string, userRole?: string): Promise<SalesRep[]> => {
  try {
    let salesRepsData;

    if (userRole === 'director') {
      // For directors, first get all users with sales_rep role
      const { data: salesRepRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'sales_rep');

      if (rolesError) {
        console.error('Error fetching sales rep roles:', rolesError);
        return [];
      }

      if (!salesRepRoles?.length) {
        console.log('No sales reps found');
        return [];
      }

      // Get profiles for all sales reps
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', salesRepRoles.map(rep => rep.user_id));

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        return [];
      }

      // Get all assessment scores for these sales reps
      const { data: scores, error: scoresError } = await supabase
        .from('assessment_scores')
        .select('*')
        .in('sales_rep_id', salesRepRoles.map(rep => rep.user_id));

      if (scoresError) {
        console.error('Error fetching scores:', scoresError);
        return [];
      }

      // Map the data to the expected format
      return profiles.map(profile => {
        const repScores = {
          month1: new Array(5).fill(0),
          month2: new Array(6).fill(0),
          month3: new Array(6).fill(0),
        };

        // Fill in the scores for this rep
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
          name: profile.full_name || profile.email || 'Unknown',
          ...repScores
        };
      });

    } else if (userRole === 'manager') {
      // If manager, get their direct reports
      const { data: salesReps, error: salesRepsError } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          manager_id,
          profiles!inner (
            full_name,
            email
          )
        `)
        .eq('role', 'sales_rep')
        .eq('manager_id', userId);

      if (salesRepsError) {
        console.error('Error fetching sales reps:', salesRepsError);
        return [];
      }

      salesRepsData = salesReps;
    }

    if (!salesRepsData || salesRepsData.length === 0) {
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
        id: rep.user_id,
        name: rep.profiles.full_name || rep.profiles.email || 'Unknown',
        ...repScores
      };
    });
  } catch (error) {
    console.error('Error in getSalesReps:', error);
    return [];
  }
};
