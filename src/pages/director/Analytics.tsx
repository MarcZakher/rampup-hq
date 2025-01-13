import React, { useEffect, useState } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { MonthlyScore, AssessmentStats, AreaOfFocus } from '@/lib/types/analytics';

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
  const { toast } = useToast();
  const [monthlyScores, setMonthlyScores] = useState<MonthlyScore[]>([]);
  const [assessmentData, setAssessmentData] = useState<AssessmentStats[]>([]);
  const [areasOfFocus, setAreasOfFocus] = useState<AreaOfFocus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [monthlyData, assessmentStats, focusAreas] = await Promise.all([
          getMonthlyScores(),
          getAssessmentData(),
          getAreasOfFocus()
        ]);

        setMonthlyScores(monthlyData);
        setAssessmentData(assessmentStats);
        setAreasOfFocus(focusAreas);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        toast({
          title: "Error",
          description: "Failed to load analytics data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

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

  const summaryMetrics = [
    {
      title: "Team Average Score",
      value: "4.2/5.0",
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      description: "+0.3 from last month"
    },
    {
      title: "Reps Meeting Target",
      value: "85%",
      icon: <Target className="h-4 w-4 text-muted-foreground" />,
      description: "Score above 3/5"
    },
    {
      title: "Completion Rate",
      value: "92%",
      icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
      description: "Of all assessments"
    },
    {
      title: "Top Performer",
      value: "John Doe",
      icon: <Trophy className="h-4 w-4 text-muted-foreground" />,
      description: "Score: 4.8/5"
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
                  <BarChart data={assessmentData}>
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
                {areasOfFocus?.repsNeedingAttention.map((rep, index) => (
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
                    data={areasOfFocus?.commonChallenges || []} 
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