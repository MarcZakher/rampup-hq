import { SalesRep } from '../types/analytics';
import { supabase } from '@/lib/supabase';

export const calculateAverage = (scores: number[]): number => {
  const validScores = scores.filter(score => score > 0);
  if (validScores.length === 0) return 0;
  return validScores.reduce((a, b) => a + b, 0) / validScores.length;
};

export const getSalesReps = async (userId: string, userRole?: string): Promise<SalesRep[]> => {
  try {
    if (userRole === 'director') {
      // For directors, get all sales reps roles
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

      // Get all sales rep profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', salesRepRoles.map(rep => rep.user_id));

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        return [];
      }

      // Get all assessment scores
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
      // For managers, get their direct reports
      const { data: salesReps, error: salesRepsError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'sales_rep')
        .eq('manager_id', userId);

      if (salesRepsError) {
        console.error('Error fetching sales reps:', salesRepsError);
        return [];
      }

      if (!salesReps?.length) return [];

      // Get profiles in a separate query
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', salesReps.map(rep => rep.user_id));

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        return [];
      }

      // Get assessment scores
      const { data: scores, error: scoresError } = await supabase
        .from('assessment_scores')
        .select('*')
        .in('sales_rep_id', salesReps.map(rep => rep.user_id));

      if (scoresError) {
        console.error('Error fetching scores:', scoresError);
        return [];
      }

      return profiles.map(profile => {
        const repScores = {
          month1: new Array(5).fill(0),
          month2: new Array(6).fill(0),
          month3: new Array(6).fill(0),
        };

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
    }

    return [];
  } catch (error) {
    console.error('Error in getSalesReps:', error);
    return [];
  }
};