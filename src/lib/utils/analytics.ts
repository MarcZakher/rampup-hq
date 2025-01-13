import { SalesRep } from '../types/analytics';
import { STORAGE_KEY } from '../constants/assessments';

export const getSalesReps = (): SalesRep[] => {
  const savedReps = localStorage.getItem(STORAGE_KEY);
  return savedReps ? JSON.parse(savedReps) : [];
};

export const calculateAverage = (scores: number[]): number => {
  const validScores = scores.filter(score => score > 0);
  if (validScores.length === 0) return 0;
  return validScores.reduce((a, b) => a + b, 0) / validScores.length;
};