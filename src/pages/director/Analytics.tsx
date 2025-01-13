import { useEffect, useState } from 'react';
import { CustomAppLayout } from '@/components/Layout/CustomAppLayout';
import { DirectorStats } from '@/components/Dashboard/DirectorStats';
import { CommonChallengesChart } from '@/components/Analytics/CommonChallengesChart';
import { AreasNeedingAttention } from '@/components/Analytics/AreasNeedingAttention';
import { AssessmentMetrics } from '@/components/Analytics/AssessmentMetrics';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useQuery } from '@tanstack/react-query';
import { ASSESSMENTS } from '@/lib/constants/assessments';

const AnalyticsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['analytics', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      // Fetch assessment scores with profiles
      const { data: scores, error: scoresError } = await supabase
        .from('assessment_scores')
        .select(`
          *,
          sales_rep:sales_rep_id(
            id,
            profiles!inner(full_name)
          )
        `);

      if (scoresError) throw scoresError;

      // Process data for different charts
      const commonChallenges = processCommonChallenges(scores);
      const areasNeedingAttention = await processAreasNeedingAttention(scores);
      const assessmentMetrics = processAssessmentMetrics(scores);

      return {
        commonChallenges,
        areasNeedingAttention,
        assessmentMetrics
      };
    },
    enabled: !!user?.id
  });

  if (isLoading) {
    return (
      <CustomAppLayout>
        <div className="p-6">Loading analytics...</div>
      </CustomAppLayout>
    );
  }

  return (
    <CustomAppLayout>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold">Performance Analytics</h1>
          <p className="text-muted-foreground">Comprehensive view of sales team performance</p>
        </div>

        <DirectorStats
          totalReps={analyticsData?.areasNeedingAttention?.length || 0}
          averageScore={calculateAverageScore(analyticsData?.assessmentMetrics)}
          performingWellCount={calculatePerformingWell(analyticsData?.assessmentMetrics)}
          topPerformer={findTopPerformer(analyticsData?.assessmentMetrics)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CommonChallengesChart data={analyticsData?.commonChallenges || []} />
          <AreasNeedingAttention data={analyticsData?.areasNeedingAttention || []} />
        </div>

        <div className="space-y-6">
          <AssessmentMetrics 
            data={analyticsData?.assessmentMetrics || []} 
            title="Assessment Completion Rates" 
          />
          <AssessmentMetrics 
            data={analyticsData?.assessmentMetrics || []} 
            title="Assessment Performance" 
          />
        </div>
      </div>
    </CustomAppLayout>
  );
};

const processCommonChallenges = (scores: any[]) => {
  const challengeCounts: { [key: string]: number } = {};
  
  scores.forEach(score => {
    if (score.score < 3) {
      const month = score.month;
      const assessmentIndex = score.assessment_index;
      const assessmentName = ASSESSMENTS[month][assessmentIndex];
      challengeCounts[assessmentName] = (challengeCounts[assessmentName] || 0) + 1;
    }
  });

  return Object.entries(challengeCounts)
    .map(([assessment, count]) => ({ assessment, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
};

const processAreasNeedingAttention = async (scores: any[]) => {
  const repScores: { [key: string]: any[] } = {};
  
  scores.forEach(score => {
    const repId = score.sales_rep_id;
    if (!repScores[repId]) {
      repScores[repId] = [];
    }
    repScores[repId].push(score);
  });

  return Object.entries(repScores)
    .map(([repId, scores]) => {
      const lowScores = scores.filter(score => score.score < 3);
      if (lowScores.length < 2) return null;

      const repName = scores[0].sales_rep.profiles.full_name;

      return {
        name: repName,
        lowScoreCount: lowScores.length,
        averageLowScore: Number((lowScores.reduce((sum, score) => sum + score.score, 0) / lowScores.length).toFixed(1)),
        areas: lowScores.map(score => ({
          assessment: ASSESSMENTS[score.month][score.assessment_index],
          score: score.score,
          month: score.month.replace('month', 'Month ')
        }))
      };
    })
    .filter(Boolean);
};

const processAssessmentMetrics = (scores: any[]) => {
  const metrics: { [key: string]: any } = {};
  
  scores.forEach(score => {
    const assessmentName = ASSESSMENTS[score.month][score.assessment_index];
    if (!metrics[assessmentName]) {
      metrics[assessmentName] = {
        name: assessmentName,
        scores: [],
        completions: 0,
        total: 0
      };
    }
    
    metrics[assessmentName].total++;
    if (score.score > 0) {
      metrics[assessmentName].completions++;
      metrics[assessmentName].scores.push(score.score);
    }
  });

  return Object.values(metrics).map(metric => ({
    name: metric.name,
    completionRate: Number(((metric.completions / metric.total) * 100).toFixed(1)),
    successRate: Number(((metric.scores.filter((s: number) => s >= 3).length / metric.scores.length) * 100).toFixed(1)),
    averageScore: Number((metric.scores.reduce((a: number, b: number) => a + b, 0) / metric.scores.length).toFixed(1))
  }));
};

const calculateAverageScore = (metrics: any[]) => {
  if (!metrics?.length) return "0.0";
  const avgScore = metrics.reduce((sum, metric) => sum + metric.averageScore, 0) / metrics.length;
  return avgScore.toFixed(1);
};

const calculatePerformingWell = (metrics: any[]) => {
  if (!metrics?.length) return 0;
  return metrics.filter(metric => metric.successRate >= 70).length;
};

const findTopPerformer = (metrics: any[]) => {
  if (!metrics?.length) return { name: "No data", score: 0 };
  
  const topMetric = metrics.reduce((top, metric) => 
    metric.averageScore > top.averageScore ? metric : top
  );

  return {
    name: topMetric.name,
    score: topMetric.averageScore
  };
};

export default AnalyticsPage;