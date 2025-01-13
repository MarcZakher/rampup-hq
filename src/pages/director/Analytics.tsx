import React from 'react';
import { CustomAppLayout } from '@/components/Layout/CustomAppLayout';
import { StatCard } from '@/components/Dashboard/StatCard';
import { Users, TrendingUp, Target, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

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
  const { user, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();

  // Fetch user role only when user is available
  const { data: userRole, isLoading: isRoleLoading } = useQuery({
    queryKey: ['userRole', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User ID not available');
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      return data?.role;
    },
    enabled: !!user?.id // Only run query when user ID is available
  });

  // Fetch sales reps data based on role when role is available
  const { data: salesRepsData, isLoading: isDataLoading } = useQuery({
    queryKey: ['salesReps', user?.id, userRole],
    queryFn: async () => {
      if (!user?.id || !userRole) throw new Error('User or role not available');

      let query = supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'sales_rep');

      // If manager, only fetch their sales reps
      if (userRole === 'manager') {
        query = query.eq('manager_id', user.id);
      }

      const { data: salesReps, error } = await query;
      if (error) throw error;

      if (!salesReps?.length) {
        return { salesReps: [], profiles: [], scores: [] };
      }

      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', salesReps.map(rep => rep.user_id));

      if (profilesError) throw profilesError;

      // Fetch scores
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
    enabled: !!user?.id && !!userRole // Only run query when both user and role are available
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
              Unable to load analytics data. Please try refreshing the page.
            </AlertDescription>
          </Alert>
        </div>
      </CustomAppLayout>
    );
  }

  const calculateMetrics = () => {
    if (!salesRepsData) return null;

    const { profiles, scores } = salesRepsData;
    
    // Calculate average scores per rep
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

    // Calculate overall metrics
    const totalReps = profiles.length;
    const avgScore = totalReps > 0 
      ? repScores.reduce((sum, rep) => sum + rep.avgScore, 0) / totalReps 
      : 0;
    const performingWell = repScores.filter(rep => rep.avgScore > 3).length;
    const topPerformer = repScores.reduce((top, rep) => 
      rep.avgScore > top.score ? { name: rep.name, score: rep.avgScore } : top,
      { name: "No reps", score: 0 }
    );

    // Calculate monthly data
    const monthlyData = ['month1', 'month2', 'month3'].map(month => {
      const monthScores = scores.filter(score => score.month === month);
      const improving = monthScores.filter(score => Number(score.score) > 3).length;
      const declining = monthScores.filter(score => Number(score.score) <= 3).length;

      return {
        month,
        improving,
        declining,
        avgScore: monthScores.length > 0
          ? (monthScores.reduce((sum, score) => sum + Number(score.score), 0) / monthScores.length).toFixed(1)
          : '0.0'
      };
    });

    return {
      totalReps,
      avgScore: avgScore.toFixed(1),
      performingWell,
      topPerformer,
      monthlyData,
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
        <h1 className="text-2xl font-bold mb-6">Performance Analytics</h1>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Sales Reps"
            value={metrics.totalReps}
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
            title="Average Score"
            value={`${metrics.avgScore}/5.0`}
            icon={<Target className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
            title="Performing Well"
            value={metrics.performingWell}
            description="Score above 3/5"
            icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
            title="Top Performer"
            value={metrics.topPerformer.name}
            description={`Score: ${metrics.topPerformer.score}/5`}
            icon={<Trophy className="h-4 w-4 text-muted-foreground" />}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Progress */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Monthly Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer config={chartConfig}>
                  <AreaChart data={metrics.monthlyData}>
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

          {/* Individual Performance */}
          <Card className="w-full">
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
      </div>
    </CustomAppLayout>
  );
};

export default AnalyticsPage;