import React from 'react';
import { CustomAppLayout } from '@/components/Layout/CustomAppLayout';
import { StatCard } from '@/components/Dashboard/StatCard';
import { Users, TrendingUp, Target, Trophy } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';

interface AssessmentScore {
  id: string;
  sales_rep_id: string;
  manager_id: string;
  month: string;
  assessment_index: number;
  score: number;
  created_at: string;
  updated_at: string;
  profiles: {
    full_name: string | null;
  } | null;
}

const Analytics = () => {
  const { data: assessmentData, isLoading } = useQuery({
    queryKey: ['assessmentScores'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No session found');
      }

      const { data, error } = await supabase
        .from('assessment_scores')
        .select(`
          *,
          profiles:sales_rep_id(full_name)
        `);

      if (error) {
        console.error('Error fetching assessment scores:', error);
        throw error;
      }

      return data as AssessmentScore[];
    }
  });

  const calculateMetrics = () => {
    if (!assessmentData || assessmentData.length === 0) {
      return {
        avgScore: 0,
        meetingTarget: 0,
        completionRate: 0,
        topPerformer: { name: 'N/A', score: 0 }
      };
    }

    // Calculate average score
    const scores = assessmentData.map(score => Number(score.score)).filter(score => !isNaN(score));
    const avgScore = scores.reduce((acc, curr) => acc + curr, 0) / scores.length;

    // Calculate reps meeting target (score >= 3)
    const meetingTarget = (scores.filter(score => score >= 3).length / scores.length) * 100;

    // Calculate completion rate
    const totalPossibleAssessments = assessmentData.length;
    const completedAssessments = scores.length;
    const completionRate = (completedAssessments / totalPossibleAssessments) * 100;

    // Find top performer
    const repScores = new Map<string, { name: string; score: number }>();
    assessmentData.forEach(assessment => {
      const repName = assessment.profiles?.full_name || 'Unknown';
      const score = Number(assessment.score) || 0;
      const currentBest = repScores.get(assessment.sales_rep_id);
      if (!currentBest || currentBest.score < score) {
        repScores.set(assessment.sales_rep_id, { name: repName, score });
      }
    });

    let topPerformer = { name: 'N/A', score: 0 };
    repScores.forEach((value) => {
      if (value.score > topPerformer.score) {
        topPerformer = value;
      }
    });

    return {
      avgScore: Number(avgScore.toFixed(1)),
      meetingTarget: Math.round(meetingTarget),
      completionRate: Math.round(completionRate),
      topPerformer
    };
  };

  const metrics = calculateMetrics();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <CustomAppLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold mb-6">Performance Analytics</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Team Average Score"
            value={`${metrics.avgScore}/5.0`}
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
            description="Across all assessments"
          />
          <StatCard
            title="Reps Meeting Target"
            value={`${metrics.meetingTarget}%`}
            icon={<Target className="h-4 w-4 text-muted-foreground" />}
            description="Score above 3/5"
          />
          <StatCard
            title="Completion Rate"
            value={`${metrics.completionRate}%`}
            icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
            description="Of all assessments"
          />
          <StatCard
            title="Top Performer"
            value={metrics.topPerformer.name}
            icon={<Trophy className="h-4 w-4 text-muted-foreground" />}
            description={`Score: ${metrics.topPerformer.score}/5`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartContainer>
            <ResponsiveContainer>
              <AreaChart data={assessmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.1} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer>
            <ResponsiveContainer>
              <BarChart data={assessmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="assessment_index" />
                <YAxis />
                <ChartTooltip />
                <Bar dataKey="score" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    </CustomAppLayout>
  );
};

export default Analytics;