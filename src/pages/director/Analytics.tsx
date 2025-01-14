import React from 'react';
import { CustomAppLayout } from '@/components/Layout/CustomAppLayout';
import { 
  getMonthlyScores, 
  getAssessmentData, 
  getAreasOfFocus,
  getTeamProgress,
  getRepPerformance
} from '@/lib/mockAnalyticsData';
import { SummaryMetrics } from '@/components/Analytics/SummaryMetrics';
import { MonthlyProgressChart } from '@/components/Analytics/MonthlyProgressChart';
import { AssessmentPerformanceChart } from '@/components/Analytics/AssessmentPerformanceChart';
import { AreasNeedingAttention } from '@/components/Analytics/AreasNeedingAttention';
import { CommonChallengesChart } from '@/components/Analytics/CommonChallengesChart';

const AnalyticsPage = () => {
  const monthlyScores = getMonthlyScores();
  const assessmentData = getAssessmentData();
  const areasOfFocus = getAreasOfFocus();
  const teamProgress = getTeamProgress();
  const repPerformance = getRepPerformance();

  // Calculate top performer
  const topPerformer = repPerformance.reduce((top, current) => 
    current.overallScore > top.overallScore ? current : top
  );

  return (
    <CustomAppLayout>
      <div className="container mx-auto p-6 space-y-8 max-w-7xl">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Performance Analytics</h1>
        </div>
        
        <SummaryMetrics 
          monthlyScores={monthlyScores}
          teamProgress={teamProgress}
          topPerformer={topPerformer}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MonthlyProgressChart data={monthlyScores} />
          <AssessmentPerformanceChart data={assessmentData} />
          <AreasNeedingAttention data={areasOfFocus} />
          <CommonChallengesChart data={areasOfFocus} />
        </div>
      </div>
    </CustomAppLayout>
  );
};

export default AnalyticsPage;