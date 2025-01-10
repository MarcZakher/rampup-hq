import { AssessmentStats } from '../types/analytics';
import { getSalesReps } from '../utils/analytics';
import { ASSESSMENTS } from '../constants/assessments';

export const getAssessmentData = async (userId: string, userRole?: string): Promise<AssessmentStats[]> => {
  const salesReps = await getSalesReps(userId, userRole);

  const getAssessmentStats = (monthKey: 'month1' | 'month2' | 'month3', index: number) => {
    const scores = salesReps.map(rep => rep[monthKey][index]).filter(score => score > 0);
    const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    const successRate = (scores.filter(score => score >= 3).length / scores.length) * 100;
    return { avgScore, successRate };
  };

  const getDifficulty = (avgScore: number): 'High' | 'Medium' | 'Low' => {
    if (avgScore < 3) return 'High';
    if (avgScore < 4) return 'Medium';
    return 'Low';
  };

  return [
    ...ASSESSMENTS.month1.map((name, index) => {
      const stats = getAssessmentStats('month1', index);
      return {
        name,
        successRate: Math.round(stats.successRate),
        avgScore: Number(stats.avgScore.toFixed(1)),
        difficulty: getDifficulty(stats.avgScore)
      };
    }),
    ...ASSESSMENTS.month2.map((name, index) => {
      const stats = getAssessmentStats('month2', index);
      return {
        name,
        successRate: Math.round(stats.successRate),
        avgScore: Number(stats.avgScore.toFixed(1)),
        difficulty: getDifficulty(stats.avgScore)
      };
    }),
    ...ASSESSMENTS.month3.map((name, index) => {
      const stats = getAssessmentStats('month3', index);
      return {
        name,
        successRate: Math.round(stats.successRate),
        avgScore: Number(stats.avgScore.toFixed(1)),
        difficulty: getDifficulty(stats.avgScore)
      };
    })
  ];
};
