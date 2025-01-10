import { RepPerformance } from '../types/analytics';
import { getSalesReps, calculateAverage } from '../utils/analytics';

export const getRepPerformance = async (userId: string, userRole?: string): Promise<RepPerformance[]> => {
  const salesReps = await getSalesReps(userId, userRole);

  const repPerformances = salesReps.map(rep => {
    const month1Avg = calculateAverage(rep.month1);
    const month2Avg = calculateAverage(rep.month2);
    const month3Avg = calculateAverage(rep.month3);
    const scores = [month1Avg, month2Avg, month3Avg].filter(score => score > 0);
    const overallScore = calculateAverage(scores);
    
    const improvement = scores.length >= 2 ? 
      scores[scores.length - 1] - scores[scores.length - 2] : 0;

    const consistency = scores.length > 0 ? 
      1 - (Math.max(...scores) - Math.min(...scores)) / 5 : 0;

    return {
      name: rep.name,
      overallScore: Number(overallScore.toFixed(1)),
      improvement: Number(improvement.toFixed(1)),
      consistency: Number(consistency.toFixed(2))
    };
  });

  // Sort by overall score in descending order
  return repPerformances.sort((a, b) => b.overallScore - a.overallScore);
};