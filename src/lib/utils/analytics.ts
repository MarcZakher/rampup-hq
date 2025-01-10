import { supabase } from '@/lib/supabase';
import { SalesRep } from '../types/analytics';

export const getSalesReps = async (managerId: string): Promise<SalesRep[]> => {
  try {
    // Get sales reps managed by this manager
    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('manager_id', managerId)
      .eq('role', 'sales_rep');

    if (rolesError) throw rolesError;

    if (!userRoles?.length) return [];

    // Get profiles for these sales reps
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name')
      .in('id', userRoles.map(role => role.user_id));

    if (profilesError) throw profilesError;

    // Get all assessment scores for these sales reps
    const { data: scores, error: scoresError } = await supabase
      .from('assessment_scores')
      .select('*')
      .eq('manager_id', managerId)
      .in('sales_rep_id', userRoles.map(role => role.user_id));

    if (scoresError) throw scoresError;

    // Map the data to the expected format
    return profiles?.map(profile => {
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
  } catch (error) {
    console.error('Error fetching sales reps:', error);
    return [];
  }
};

export const calculateAverage = (scores: number[]): number => {
  const validScores = scores.filter(score => score > 0);
  if (validScores.length === 0) return 0;
  return validScores.reduce((a, b) => a + b, 0) / validScores.length;
};