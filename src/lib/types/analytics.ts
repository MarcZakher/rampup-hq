export interface SalesRep {
  id: number;
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