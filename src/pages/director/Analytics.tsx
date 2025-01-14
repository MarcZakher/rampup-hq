import React from 'react';
import { CustomAppLayout } from '@/components/Layout/CustomAppLayout';
import { StatCard } from '@/components/Dashboard/StatCard';
import { Users, TrendingUp, Target, Trophy, AlertTriangle } from 'lucide-react';
import { 
  getMonthlyScores, 
  getAssessmentData, 
  getAreasOfFocus,
  getTeamProgress 
} from '@/lib/mockAnalyticsData';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const chartConfig = {
  improving: {
    theme: {
      light: '#10B981',
      dark: '#059669',
    },
  },
  declining: {
    theme: {
      light: '#EF4444',
      dark: '#DC2626',
    },
  },
  primary: {
    theme: {
      light: '#8884d8',
      dark: '#6366f1',
    },
  },
  secondary: {
    theme: {
      light: '#82ca9d',
      dark: '#10b981',
    },
  },
  warning: {
    theme: {
      light: '#fbbf24',
      dark: '#d97706',
    },
  },
};

const AnalyticsPage = () => {
  // First check if we have a valid session
  const { data: assessmentData, isLoading: isLoadingAssessments } = useQuery({
    queryKey: ['assessmentScores'],
    queryFn: async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error('Authentication required');
      }

      // Use a proper join with the profiles table
      const { data: scores, error } = await supabase
        .from('assessment_scores')
        .select(`
          *,
          sales_rep:sales_rep_id(
            profile:profiles(full_name)
          )
        `);
      
      if (error) throw error;
      return scores;
    }
  });

  // Calculate metrics from real data
  const calculateMetrics = () => {
    if (!assessmentData) return {
      avgScore: "0.0",
      meetingTarget: 0,
      completionRate: 0,
      topPerformer: { name: "N/A", score: 0 }
    };

    // Calculate average score
    const validScores = assessmentData.filter(score => score.score !== null);
    const avgScore = validScores.length > 0 
      ? (validScores.reduce((sum, score) => sum + (score.score || 0), 0) / validScores.length).toFixed(1)
      : "0.0";

    // Calculate reps meeting target (score >= 3)
    const meetingTarget = validScores.length > 0
      ? Math.round((validScores.filter(score => (score.score || 0) >= 3).length / validScores.length) * 100)
      : 0;

    // Calculate completion rate
    const totalPossibleAssessments = assessmentData.length || 1; // Prevent division by zero
    const completionRate = Math.round((validScores.length / totalPossibleAssessments) * 100);

    // Find top performer
    const repScores = validScores.reduce((acc, score) => {
      const repName = score.sales_rep?.profile?.full_name || 'Unknown';
      if (!acc[score.sales_rep_id]) {
        acc[score.sales_rep_id] = { 
          name: repName,
          scores: []
        };
      }
      acc[score.sales_rep_id].scores.push(score.score || 0);
      return acc;
    }, {} as Record<string, { name: string, scores: number[] }>);

    const topPerformer = Object.values(repScores).reduce((top, rep) => {
      const avgScore = rep.scores.reduce((sum, score) => sum + score, 0) / rep.scores.length;
      return avgScore > (top.score || 0) ? { name: rep.name, score: avgScore } : top;
    }, { name: "N/A", score: 0 });

    return {
      avgScore,
      meetingTarget,
      completionRate,
      topPerformer
    };
  };

  const metrics = calculateMetrics();
  const monthlyScores = getMonthlyScores();
  const assessmentDataChart = getAssessmentData();
  const areasOfFocus = getAreasOfFocus();
  const teamProgress = getTeamProgress();

  const summaryMetrics = [
    {
      title: "Team Average Score",
      value: `${metrics.avgScore}/5.0`,
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      description: "Overall performance"
    },
    {
      title: "Reps Meeting Target",
      value: `${metrics.meetingTarget}%`,
      icon: <Target className="h-4 w-4 text-muted-foreground" />,
      description: "Score above 3/5"
    },
    {
      title: "Completion Rate",
      value: `${metrics.completionRate}%`,
      icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
      description: "Of all assessments"
    },
    {
      title: "Top Performer",
      value: metrics.topPerformer.name,
      icon: <Trophy className="h-4 w-4 text-muted-foreground" />,
      description: `Score: ${metrics.topPerformer.score.toFixed(1)}/5`
    }
  ];

  return (
    <CustomAppLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold mb-6">Performance Analytics</h1>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {summaryMetrics.map((metric, index) => (
            <StatCard
              key={index}
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
              description={metric.description}
            />
          ))}
        </div>

        {/* Two Column Layout for Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Progress */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Monthly Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer config={chartConfig}>
                  <AreaChart data={monthlyScores}>
                    <defs>
                      <linearGradient id="improving" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="declining" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip />
                    <Area 
                      type="monotone" 
                      dataKey="improving" 
                      stroke="#10B981" 
                      fillOpacity={1} 
                      fill="url(#improving)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="declining" 
                      stroke="#EF4444" 
                      fillOpacity={1} 
                      fill="url(#declining)" 
                    />
                  </AreaChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Assessment Performance */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Assessment Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer config={chartConfig}>
                  <BarChart data={assessmentDataChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip />
                    <Bar dataKey="successRate" fill="#8884d8" name="Success Rate %" />
                    <Bar dataKey="avgScore" fill="#82ca9d" name="Average Score" />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Areas Needing Attention */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Areas Needing Attention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {areasOfFocus.repsNeedingAttention.map((rep, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="text-lg font-semibold">{rep.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {rep.lowScoreCount} low scores (avg: {rep.averageLowScore})
                    </p>
                    <div className="space-y-2">
                      {rep.areas.map((area, areaIndex) => (
                        <div key={areaIndex} className="flex justify-between text-sm">
                          <span className="text-red-500">{area.assessment}</span>
                          <span>{area.month} - Score: {area.score}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Common Challenges */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Common Challenges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer config={chartConfig}>
                  <BarChart 
                    data={areasOfFocus.commonChallenges} 
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="assessment" type="category" width={150} />
                    <ChartTooltip />
                    <Bar dataKey="count" fill="#fbbf24" />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </CustomAppLayout>
  );
};

export default AnalyticsPage;