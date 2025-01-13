import { MonthlyScore } from '../types/analytics';
import { getSalesReps, calculateAverage } from '../utils/analytics';

export const getMonthlyScores = async (): Promise<MonthlyScore[]> => {
  const salesReps = await getSalesReps();

  if (salesReps.length === 0) {
    return Array(3).fill({
      month: '',
      avgScore: '0.0',
      totalReps: 0,
      improving: 0,
      declining: 0
    });
  }

  return [
    {
      month: 'Month 1',
      avgScore: Number(calculateAverage(salesReps.map(rep => calculateAverage(rep.month1)))).toFixed(1),
      totalReps: salesReps.length,
      improving: salesReps.filter(rep => calculateAverage(rep.month1) > 3).length,
      declining: salesReps.filter(rep => calculateAverage(rep.month1) <= 3).length
    },
    {
      month: 'Month 2',
      avgScore: Number(calculateAverage(salesReps.map(rep => calculateAverage(rep.month2)))).toFixed(1),
      totalReps: salesReps.length,
      improving: salesReps.filter(rep => calculateAverage(rep.month2) > 3).length,
      declining: salesReps.filter(rep => calculateAverage(rep.month2) <= 3).length
    },
    {
      month: 'Month 3',
      avgScore: Number(calculateAverage(salesReps.map(rep => calculateAverage(rep.month3)))).toFixed(1),
      totalReps: salesReps.length,
      improving: salesReps.filter(rep => calculateAverage(rep.month3) > 3).length,
      declining: salesReps.filter(rep => calculateAverage(rep.month3) <= 3).length
    }
  ];
};