export interface SalesRep {
  id: string;  // Changed from number to string to match Supabase UUID
  name: string;
  month1: number[];
  month2: number[];
  month3: number[];
}

export interface MonthlyScore {
  month: string;
  avgScore: string;
  totalReps: number;
  improving: number;
  declining: number;
}

export interface AssessmentStats {
  name: string;
  successRate: number;
  avgScore: number;
  difficulty: 'High' | 'Medium' | 'Low';
}

export interface RepPerformance {
  name: string;
  overallScore: number;
  improvement: number;
  consistency: number;
}

export interface ScoreDistribution {
  range: string;
  count: number;
}

export interface TeamProgress {
  meetingTarget: number;
  completionRate: number;
  averageImprovement: number;
}

export interface AreaOfFocus {
  repsNeedingAttention: {
    name: string;
    lowScoreCount: number;
    averageLowScore: number;
    areas: {
      assessment: string;
      score: number;
      month: string;
    }[];
  }[];
  commonChallenges: {
    assessment: string;
    count: number;
  }[];
}

export interface RampingMetrics {
  dm: {
    actual: number;
    target: number;
  };
  nbm: {
    actual: number;
    target: number;
  };
  scopePlus: {
    actual: number;
    target: number;
  };
  newLogo: {
    actual: number;
    target: number;
  };
}

export interface RepRampingData {
  name: string;
  metrics: {
    [month: number]: RampingMetrics;
  };
  isAtRisk: boolean;
  isStarPerformer: boolean;
  timeToFirstLogo?: number;
}

export interface TeamRampMetrics {
  dmAchievementRate: number;
  nbmAchievementRate: number;
  scopePlusAchievementRate: number;
  newLogoAchievementRate: number;
  averageRampingTimeline: number;
  averageTimeToFirstLogo: number;
}