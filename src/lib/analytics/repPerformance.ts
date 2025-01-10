import { RepPerformance } from '../types/analytics';
import { getSalesReps, calculateAverage } from '../utils/analytics';
import { useAuth } from '@/lib/context/auth-context';
import { useQuery } from '@tanstack/react-query';

export const useRepPerformance = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['repPerformance', user?.id],
    queryFn: async (): Promise<RepPerformance[]> => {
      if (!user?.id) return [];
      
      const salesReps = await getSalesReps(user.id);

      return salesReps.map(rep => {
        // Calculate averages for each month, filtering out zero scores
        const month1Scores = rep.month1.filter(score => score > 0);
        const month2Scores = rep.month2.filter(score => score > 0);
        const month3Scores = rep.month3.filter(score => score > 0);

        const month1Avg = month1Scores.length > 0 ? 
          month1Scores.reduce((sum, score) => sum + score, 0) / month1Scores.length : 0;
        const month2Avg = month2Scores.length > 0 ? 
          month2Scores.reduce((sum, score) => sum + score, 0) / month2Scores.length : 0;
        const month3Avg = month3Scores.length > 0 ? 
          month3Scores.reduce((sum, score) => sum + score, 0) / month3Scores.length : 0;

        // Calculate overall score as the average of all non-zero monthly averages
        const validScores = [month1Avg, month2Avg, month3Avg].filter(score => score > 0);
        const overallScore = validScores.length > 0 ? 
          validScores.reduce((sum, score) => sum + score, 0) / validScores.length : 0;

        // Calculate improvement based on the last two valid monthly averages
        const validMonthlyAverages = [month1Avg, month2Avg, month3Avg]
          .filter(score => score > 0);
        const improvement = validMonthlyAverages.length >= 2 ? 
          validMonthlyAverages[validMonthlyAverages.length - 1] - 
          validMonthlyAverages[validMonthlyAverages.length - 2] : 0;

        // Calculate consistency (1 - standard deviation / max possible score)
        const validScoresArray = [...month1Scores, ...month2Scores, ...month3Scores];
        const mean = validScoresArray.length > 0 ? 
          validScoresArray.reduce((sum, score) => sum + score, 0) / validScoresArray.length : 0;
        
        const variance = validScoresArray.length > 0 ?
          validScoresArray.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / 
          validScoresArray.length : 0;
        
        const standardDeviation = Math.sqrt(variance);
        const consistency = validScoresArray.length > 0 ? 
          1 - (standardDeviation / 5) : 0; // 5 is the max possible score

        return {
          name: rep.name,
          overallScore: Number(overallScore.toFixed(1)),
          improvement: Number(improvement.toFixed(1)),
          consistency: Number(consistency.toFixed(2))
        };
      }).sort((a, b) => b.overallScore - a.overallScore); // Sort by overall score in descending order
    },
    enabled: !!user?.id
  });
};