import { AssessmentStats } from '../types/analytics';
import { getSalesReps } from '../utils/analytics';
import { ASSESSMENTS } from '../constants/assessments';

export const getAssessmentData = (): AssessmentStats[] => {
  const salesReps = getSalesReps();

  const getAssessmentStats = (monthKey: 'month1' | 'month2' | 'month3', index: number) => {
    const scores = salesReps.map(rep => rep[monthKey][index]).filter(score => score > 0);
    const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    const successRate = (scores.filter(score => score >= 3).length / scores.length) * 100;
    return { avgScore, successRate };
  };

  return [
    ...ASSESSMENTS.month1.map((name, index) => {
      const stats = getAssessmentStats('month1', index);
      return {
        name,
        successRate: Math.round(stats.successRate),
        avgScore: Number(stats.avgScore.toFixed(1)),
        difficulty: stats.avgScore < 3 ? 'High' : stats.avgScore < 4 ? 'Medium' : 'Low'
      };
    }),
    ...ASSESSMENTS.month2.map((name, index) => {
      const stats = getAssessmentStats('month2', index);
      return {
        name,
        successRate: Math.round(stats.successRate),
        avgScore: Number(stats.avgScore.toFixed(1)),
        difficulty: stats.avgScore < 3 ? 'High' : stats.avgScore < 4 ? 'Medium' : 'Low'
      };
    }),
    ...ASSESSMENTS.month3.map((name, index) => {
      const stats = getAssessmentStats('month3', index);
      return {
        name,
        successRate: Math.round(stats.successRate),
        avgScore: Number(stats.avgScore.toFixed(1)),
        difficulty: stats.avgScore < 3 ? 'High' : stats.avgScore < 4 ? 'Medium' : 'Low'
      };
    })
  ];
};