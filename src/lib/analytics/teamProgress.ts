import { TeamProgress } from '../types/analytics';
import { useAuth } from '@/lib/context/auth-context';
import { useQuery } from '@tanstack/react-query';
import { getSalesReps } from '../utils/analytics';

export const useTeamProgress = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['teamProgress', user?.id],
    queryFn: async (): Promise<TeamProgress> => {
      if (!user?.id) return { meetingTarget: 0, completionRate: 0, averageImprovement: 0 };
      
      const salesReps = await getSalesReps(user.id);

      const totalScores = salesReps.flatMap(rep => [
        ...rep.month1,
        ...rep.month2,
        ...rep.month3
      ]).filter(score => score > 0);

      const meetingTarget = totalScores.length > 0 ?
        Math.round((totalScores.filter(score => score >= 3).length / totalScores.length) * 100) : 0;

      const completionRate = salesReps.length > 0 ?
        Math.round((totalScores.length / (salesReps.length * (5 + 6 + 6))) * 100) : 0;

      const monthlyAverages = salesReps.map(rep => [
        rep.month1.reduce((sum, score) => sum + (score > 0 ? score : 0), 0) / rep.month1.filter(score => score > 0).length || 0,
        rep.month2.reduce((sum, score) => sum + (score > 0 ? score : 0), 0) / rep.month2.filter(score => score > 0).length || 0,
        rep.month3.reduce((sum, score) => sum + (score > 0 ? score : 0), 0) / rep.month3.filter(score => score > 0).length || 0
      ].filter(avg => avg > 0));

      const averageImprovement = monthlyAverages.reduce((sum, reps) => {
        if (reps.length >= 2) {
          return sum + (reps[reps.length - 1] - reps[reps.length - 2]);
        }
        return sum;
      }, 0) / (salesReps.length || 1);

      return {
        meetingTarget,
        completionRate,
        averageImprovement: Number(averageImprovement.toFixed(1))
      };
    },
    enabled: !!user?.id
  });
};