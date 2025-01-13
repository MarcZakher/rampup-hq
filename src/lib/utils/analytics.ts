import { supabase } from '@/integrations/supabase/client';

export const getSalesReps = async () => {
  const { data: userRoles, error: rolesError } = await supabase
    .from('user_roles')
    .select('user_id')
    .eq('role', 'sales_rep');

  if (rolesError) {
    console.error('Error fetching sales reps:', rolesError);
    return [];
  }

  const salesRepIds = userRoles.map(role => role.user_id);

  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .in('id', salesRepIds);

  if (profilesError) {
    console.error('Error fetching profiles:', profilesError);
    return [];
  }

  const { data: scores, error: scoresError } = await supabase
    .from('assessment_scores')
    .select('*')
    .in('sales_rep_id', salesRepIds);

  if (scoresError) {
    console.error('Error fetching scores:', scoresError);
    return [];
  }

  // Group scores by sales rep and month
  const salesReps = profiles.map(profile => {
    const repScores = scores.filter(score => score.sales_rep_id === profile.id);
    
    // Initialize score arrays for each month
    const month1 = new Array(5).fill(0);
    const month2 = new Array(6).fill(0);
    const month3 = new Array(6).fill(0);

    // Fill in actual scores
    repScores.forEach(score => {
      const monthNum = parseInt(score.month.split(' ')[1]);
      const assessmentIndex = score.assessment_index;
      const scoreValue = score.score || 0;

      if (monthNum === 1 && assessmentIndex < month1.length) {
        month1[assessmentIndex] = scoreValue;
      } else if (monthNum === 2 && assessmentIndex < month2.length) {
        month2[assessmentIndex] = scoreValue;
      } else if (monthNum === 3 && assessmentIndex < month3.length) {
        month3[assessmentIndex] = scoreValue;
      }
    });

    return {
      id: profile.id,
      name: profile.full_name || 'Unknown',
      month1,
      month2,
      month3
    };
  });

  return salesReps;
};

export const calculateAverage = (scores: number[]): number => {
  const validScores = scores.filter(score => score > 0);
  if (validScores.length === 0) return 0;
  return validScores.reduce((a, b) => a + b, 0) / validScores.length;
};