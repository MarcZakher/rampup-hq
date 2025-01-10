import { AreaOfFocus } from '../types/analytics';
import { getSalesReps } from '../utils/analytics';
import { assessments } from '@/constants/assessments';
import { useAuth } from '@/lib/context/auth-context';
import { useQuery } from '@tanstack/react-query';

export const useAreasOfFocus = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['areasOfFocus', user?.id],
    queryFn: async (): Promise<AreaOfFocus> => {
      if (!user?.id) return { repsNeedingAttention: [], commonChallenges: [] };
      
      const salesReps = await getSalesReps(user.id);

      const concerningReps = salesReps.map(rep => {
        const month1Avg = rep.month1.reduce((sum, score) => sum + (score > 0 ? score : 0), 0) / 
          rep.month1.filter(score => score > 0).length || 0;
        const month2Avg = rep.month2.reduce((sum, score) => sum + (score > 0 ? score : 0), 0) / 
          rep.month2.filter(score => score > 0).length || 0;
        const month3Avg = rep.month3.reduce((sum, score) => sum + (score > 0 ? score : 0), 0) / 
          rep.month3.filter(score => score > 0).length || 0;

        const hasConsecutiveLowScores = 
          (month1Avg < 3 && month2Avg < 3) || 
          (month2Avg < 3 && month3Avg < 3);

        if (!hasConsecutiveLowScores) return null;

        const lowScoreAreas = [];
        
        rep.month1.forEach((score, index) => {
          if (score > 0 && score < 3) {
            lowScoreAreas.push({
              assessment: assessments.month1[index].name,
              score,
              month: 'Month 1'
            });
          }
        });

        rep.month2.forEach((score, index) => {
          if (score > 0 && score < 3) {
            lowScoreAreas.push({
              assessment: assessments.month2[index].name,
              score,
              month: 'Month 2'
            });
          }
        });

        rep.month3.forEach((score, index) => {
          if (score > 0 && score < 3) {
            lowScoreAreas.push({
              assessment: assessments.month3[index].name,
              score,
              month: 'Month 3'
            });
          }
        });

        if (lowScoreAreas.length < 2) return null;

        return {
          name: rep.name,
          lowScoreCount: lowScoreAreas.length,
          averageLowScore: Number((lowScoreAreas.reduce((a, b) => a + b.score, 0) / lowScoreAreas.length).toFixed(1)),
          areas: lowScoreAreas
        };
      }).filter(Boolean);

      const assessmentPatterns: { [key: string]: number } = {};
      concerningReps.forEach(rep => {
        rep?.areas.forEach(area => {
          assessmentPatterns[area.assessment] = (assessmentPatterns[area.assessment] || 0) + 1;
        });
      });

      return {
        repsNeedingAttention: concerningReps,
        commonChallenges: Object.entries(assessmentPatterns)
          .map(([assessment, count]) => ({
            assessment,
            count
          }))
          .sort((a, b) => b.count - a.count)
      };
    },
    enabled: !!user?.id
  });
};