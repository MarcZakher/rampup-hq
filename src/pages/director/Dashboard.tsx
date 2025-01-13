import { useAuth } from '@/hooks/use-auth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CustomAppLayout } from '@/components/Layout/CustomAppLayout';
import { DirectorStats } from '@/components/Dashboard/DirectorStats';
import { TrainingProgress } from '@/components/Dashboard/TrainingProgress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';

const chartConfig = {
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const DirectorDashboard = () => {
  const { user, isLoading: isAuthLoading } = useAuth();

  const { data: userRole, isLoading: isRoleLoading } = useQuery({
    queryKey: ['userRole', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User ID not available');
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data?.role;
    },
    enabled: !!user?.id
  });

  const { data: salesRepsData, isLoading: isDataLoading } = useQuery({
    queryKey: ['salesReps', user?.id, userRole],
    queryFn: async () => {
      if (!user?.id || !userRole) throw new Error('User or role not available');

      const { data: salesReps, error } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'sales_rep');

      if (error) throw error;

      if (!salesReps?.length) {
        return { salesReps: [], profiles: [], scores: [] };
      }

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', salesReps.map(rep => rep.user_id));

      if (profilesError) throw profilesError;

      const { data: scores, error: scoresError } = await supabase
        .from('assessment_scores')
        .select('*')
        .in('sales_rep_id', salesReps.map(rep => rep.user_id));

      if (scoresError) throw scoresError;

      return {
        salesReps,
        profiles: profiles || [],
        scores: scores || []
      };
    },
    enabled: !!user?.id && !!userRole
  });

  const isLoading = isAuthLoading || isRoleLoading || isDataLoading;

  if (isLoading) {
    return (
      <CustomAppLayout>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </CustomAppLayout>
    );
  }

  if (!user || !userRole || !salesRepsData) {
    return (
      <CustomAppLayout>
        <div className="p-6">
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Unable to load dashboard data. Please try refreshing the page.
            </AlertDescription>
          </Alert>
        </div>
      </CustomAppLayout>
    );
  }

  const calculateMetrics = () => {
    if (!salesRepsData) return null;

    const { profiles, scores } = salesRepsData;
    
    const repScores = profiles.map(profile => {
      const repScores = scores.filter(score => score.sales_rep_id === profile.id);
      const avgScore = repScores.length > 0
        ? repScores.reduce((sum, score) => sum + Number(score.score), 0) / repScores.length
        : 0;
      
      return {
        name: profile.full_name,
        avgScore: Number(avgScore.toFixed(1))
      };
    });

    const totalReps = profiles.length;
    const avgScore = totalReps > 0 
      ? (repScores.reduce((sum, rep) => sum + rep.avgScore, 0) / totalReps).toFixed(1)
      : '0.0';
    const performingWell = repScores.filter(rep => rep.avgScore > 3).length;
    const topPerformer = repScores.reduce((top, rep) => 
      rep.avgScore > top.score ? { name: rep.name, score: rep.avgScore } : top,
      { name: "No reps", score: 0 }
    );

    // Calculate assessment completion rates
    const totalAssessments = scores.length;
    const completionByMonth = {
      'Month 1': scores.filter(score => score.month === 'month1').length,
      'Month 2': scores.filter(score => score.month === 'month2').length,
      'Month 3': scores.filter(score => score.month === 'month3').length,
    };

    // Calculate assessment performance distribution
    const scoreDistribution = [
      { range: '4.5-5.0', count: scores.filter(s => Number(s.score) >= 4.5).length },
      { range: '4.0-4.4', count: scores.filter(s => Number(s.score) >= 4.0 && Number(s.score) < 4.5).length },
      { range: '3.5-3.9', count: scores.filter(s => Number(s.score) >= 3.5 && Number(s.score) < 4.0).length },
      { range: '3.0-3.4', count: scores.filter(s => Number(s.score) >= 3.0 && Number(s.score) < 3.5).length },
      { range: '0.0-2.9', count: scores.filter(s => Number(s.score) < 3.0).length },
    ];

    // Calculate common challenges
    const lowScores = scores.filter(s => Number(s.score) < 3);
    const challengesByAssessment = lowScores.reduce((acc: { [key: string]: number }, score) => {
      const key = `${score.month}-${score.assessment_index}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const commonChallenges = Object.entries(challengesByAssessment)
      .map(([key, count]) => ({
        assessment: key,
        count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalReps,
      avgScore,
      performingWell,
      topPerformer,
      completionByMonth,
      scoreDistribution,
      commonChallenges,
      repScores
    };
  };

  const metrics = calculateMetrics();

  if (!metrics) {
    return (
      <CustomAppLayout>
        <div className="p-6">
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Unable to calculate metrics. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </CustomAppLayout>
    );
  }

  return (
    <CustomAppLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold mb-6">Director Dashboard</h1>
        
        <DirectorStats
          totalReps={metrics.totalReps}
          averageScore={metrics.avgScore}
          performingWellCount={metrics.performingWell}
          topPerformer={metrics.topPerformer}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Completion Rates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer config={chartConfig}>
                  <BarChart data={Object.entries(metrics.completionByMonth).map(([month, count]) => ({ month, count }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Score Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer config={chartConfig}>
                  <PieChart>
                    <Pie
                      data={metrics.scoreDistribution}
                      dataKey="count"
                      nameKey="range"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {metrics.scoreDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip />
                  </PieChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Common Challenges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer config={chartConfig}>
                  <BarChart data={metrics.commonChallenges}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="assessment" />
                    <YAxis />
                    <ChartTooltip />
                    <Bar dataKey="count" fill="#82ca9d" />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Individual Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer config={chartConfig}>
                  <BarChart data={metrics.repScores}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 5]} />
                    <ChartTooltip />
                    <Bar dataKey="avgScore" fill="#8884d8" name="Average Score" />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <TrainingProgress />
      </div>
    </CustomAppLayout>
  );
};

export default DirectorDashboard;