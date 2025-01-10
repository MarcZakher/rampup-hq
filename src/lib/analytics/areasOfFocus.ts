import { AreaOfFocus } from '../types/analytics';
import { getSalesReps } from '../utils/analytics';
import { ASSESSMENTS } from '../constants/assessments';

export const getAreasOfFocus = (): AreaOfFocus => {
  const salesReps = getSalesReps();

  const concerningReps = salesReps.map(rep => {
    const allScores = [...rep.month1, ...rep.month2, ...rep.month3];
    const lowScores = allScores.filter(score => score > 0 && score < 3);
    
    if (lowScores.length === 0) return null;

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

    return {
      name: rep.name,
      lowScoreCount: lowScores.length,
      averageLowScore: Number((lowScores.reduce((a, b) => a + b, 0) / lowScores.length).toFixed(1)),
      areas: lowScoreAreas
    };
  }).filter(Boolean);

  const assessmentPatterns = concerningReps.flatMap(rep => rep?.areas || [])
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