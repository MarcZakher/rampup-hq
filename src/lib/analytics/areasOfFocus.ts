import { AreaOfFocus } from '../types/analytics';
import { getSalesReps, calculateAverage } from '../utils/analytics';
import { ASSESSMENTS } from '../constants/assessments';

export const getAreasOfFocus = async (userId: string, userRole?: string): Promise<AreaOfFocus> => {
  const salesReps = await getSalesReps(userId, userRole);

  const concerningReps = salesReps.map(rep => {
    // Calculate monthly averages
    const month1Avg = calculateAverage(rep.month1);
    const month2Avg = calculateAverage(rep.month2);
    const month3Avg = calculateAverage(rep.month3);

    // Check for consecutive months below threshold
    const hasConsecutiveLowScores = 
      (month1Avg < 3 && month2Avg < 3) || 
      (month2Avg < 3 && month3Avg < 3);

    if (!hasConsecutiveLowScores) return null;

    // Get all low scores across months
    const lowScoreAreas = [];
    
    rep.month1.forEach((score, index) => {
      if (score > 0 && score < 3) {
        lowScoreAreas.push({
          assessment: ASSESSMENTS.month1[index],
          score,
          month: 'Month 1'
        });
      }
    });

    rep.month2.forEach((score, index) => {
      if (score > 0 && score < 3) {
        lowScoreAreas.push({
          assessment: ASSESSMENTS.month2[index],
          score,
          month: 'Month 2'
        });
      }
    });

    rep.month3.forEach((score, index) => {
      if (score > 0 && score < 3) {
        lowScoreAreas.push({
          assessment: ASSESSMENTS.month3[index],
          score,
          month: 'Month 3'
        });
      }
    });

    // Only include reps with multiple low-scoring assessments
    if (lowScoreAreas.length < 2) return null;

    return {
      name: rep.name,
      lowScoreCount: lowScoreAreas.length,
      averageLowScore: Number((lowScoreAreas.reduce((a, b) => a + b.score, 0) / lowScoreAreas.length).toFixed(1)),
      areas: lowScoreAreas
    };
  }).filter(Boolean);

  const assessmentPatterns: { [key: string]: number } = concerningReps.flatMap(rep => rep?.areas || [])
    .reduce((acc: { [key: string]: number }, curr) => {
      acc[curr.assessment] = (acc[curr.assessment] || 0) + 1;
      return acc;
    }, {});

  return {
    repsNeedingAttention: concerningReps,
    commonChallenges: Object.entries(assessmentPatterns)
      .sort(([, a], [, b]) => b - a)
      .map(([assessment, count]) => ({
        assessment,
        count
      }))
  };
};