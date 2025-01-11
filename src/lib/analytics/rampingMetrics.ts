import { RepRampingData, TeamRampMetrics } from '../types/analytics';

const TARGET_METRICS = {
  dm: [5, 10, 15, 20, 20, 20],
  nbm: [0, 1, 1, 1, 2, 2],
  scopePlus: [0, 0, 1, 1, 1, 1],
  newLogo: [0, 0, 0, 0, 0, 1]
};

export const getRampingData = (): RepRampingData[] => {
  // Mock data for demonstration
  return [
    {
      name: "John Doe",
      metrics: {
        1: {
          dm: { actual: 6, target: 5 },
          nbm: { actual: 0, target: 0 },
          scopePlus: { actual: 0, target: 0 },
          newLogo: { actual: 0, target: 0 }
        },
        // Add more months...
      },
      isAtRisk: false,
      isStarPerformer: true,
      timeToFirstLogo: 5
    },
    // Add more reps...
  ];
};

export const getTeamRampMetrics = (): TeamRampMetrics => {
  const rampingData = getRampingData();
  
  return {
    dmAchievementRate: 85,
    nbmAchievementRate: 75,
    scopePlusAchievementRate: 80,
    newLogoAchievementRate: 60,
    averageRampingTimeline: 5.5,
    averageTimeToFirstLogo: 5.2
  };
};

export const getTargetMetrics = () => TARGET_METRICS;