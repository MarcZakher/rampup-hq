import { ScoreDistribution } from '../types/analytics';
import { getSalesReps, calculateAverage } from '../utils/analytics';

export const getScoreDistribution = (): ScoreDistribution[] => {
  const salesReps = getSalesReps();

  const ranges = [
    { range: '4.5-5.0', min: 4.5, max: 5.0 },
    { range: '4.0-4.4', min: 4.0, max: 4.4 },
    { range: '3.5-3.9', min: 3.5, max: 3.9 },
    { range: '3.0-3.4', min: 3.0, max: 3.4 },
    { range: '0.0-2.9', min: 0, max: 2.9 }
  ];

  return ranges.map(({ range, min, max }) => {
    const count = salesReps.filter(rep => {
      const avgScore = calculateAverage([
        ...rep.month1,
        ...rep.month2,
        ...rep.month3
      ]);
      return avgScore >= min && avgScore <= max;
    }).length;

    return { range, count };
  });
};