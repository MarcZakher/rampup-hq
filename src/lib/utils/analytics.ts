// Mock data for a single sales rep's scores
export const getSalesReps = () => {
  return [
    {
      id: 1,
      name: "John Doe",
      month1: [85, 90, 88, 92, 87],
      month2: [89, 91, 86, 88, 90],
      month3: [92, 94, 90, 93, 91]
    }
  ];
};

export const calculateAverage = (scores: number[]): number => {
  const validScores = scores.filter(score => score > 0);
  if (validScores.length === 0) return 0;
  return validScores.reduce((a, b) => a + b, 0) / validScores.length;
};