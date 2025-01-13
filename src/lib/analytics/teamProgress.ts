import { TeamProgress } from '../types/analytics';
import { getSalesReps, calculateAverage } from '../utils/analytics';

export const getTeamProgress = async (): Promise<TeamProgress> => {
  const salesReps = await getSalesReps();

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
    calculateAverage(rep.month1),
    calculateAverage(rep.month2),
    calculateAverage(rep.month3)
  ].filter(avg => avg > 0));

  const averageImprovement = monthlyAverages.reduce((sum, reps) => {
    if (reps.length >= 2) {
      return sum + (reps[reps.length - 1] - reps[reps.length - 2]);
    }
    return sum;
  }, 0) / salesReps.length;

  return {
    meetingTarget,
    completionRate,
    averageImprovement: Number(averageImprovement.toFixed(1))
  };
};