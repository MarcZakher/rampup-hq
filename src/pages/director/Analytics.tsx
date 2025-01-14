import React from 'react';
import { CustomAppLayout } from '@/components/Layout/CustomAppLayout';
import { StatCard } from '@/components/Dashboard/StatCard';
import { Users, TrendingUp, Target, Trophy, AlertTriangle } from 'lucide-react';
import { 
  getMonthlyScores, 
  getAssessmentData, 
  getAreasOfFocus,
  getTeamProgress,
  getRepPerformance
} from '@/lib/mockAnalyticsData';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
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
  const monthlyScores = getMonthlyScores();
  const assessmentData = getAssessmentData();
  const areasOfFocus = getAreasOfFocus();
  const teamProgress = getTeamProgress();
  const repPerformance = getRepPerformance();

  // Calculate top performer
  const topPerformer = repPerformance.reduce((top, current) => 
    current.overallScore > top.overallScore ? current : top
  );

  const summaryMetrics = [
    {
      title: "Team Average Score",
      value: `${monthlyScores[monthlyScores.length - 1].avgScore}/5.0`,
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      description: `+${teamProgress.averageImprovement} from last month`
    },
    {
      title: "Reps Meeting Target",
      value: `${teamProgress.meetingTarget}%`,
      icon: <Target className="h-4 w-4 text-muted-foreground" />,
      description: "Score above 3/5"
    },
    {
      title: "Completion Rate",
      value: `${teamProgress.completionRate}%`,
      icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
      description: "Of all assessments"
    },
    {
      title: "Top Performer",
      value: topPerformer.name,
      icon: <Trophy className="h-4 w-4 text-muted-foreground" />,
      description: `Score: ${topPerformer.overallScore}/5`
    }
  ];

  return (
    <CustomAppLayout>
      <div className="container mx-auto p-6 space-y-8 max-w-7xl">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Performance Analytics</h1>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Progress */}
          <Card className="w-full shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Monthly Progress</CardTitle>
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
          <Card className="w-full shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Assessment Performance</CardTitle>
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
          <Card className="w-full shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <AlertTriangle className="h-6 w-6 text-yellow-500" />
                Areas Needing Attention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 max-h-[300px] overflow-y-auto">
                {areasOfFocus.repsNeedingAttention.map((rep, index) => (
                  <div key={index} className="p-4 bg-yellow-50 rounded-lg space-y-2">
                    <h3 className="text-lg font-semibold">{rep.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {rep.lowScoreCount} low scores (avg: {rep.averageLowScore})
                    </p>
                    <div className="space-y-2">
                      {rep.areas.map((area, areaIndex) => (
                        <div key={areaIndex} className="flex justify-between text-sm">
                          <span className="text-red-500 font-medium">{area.assessment}</span>
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
          <Card className="w-full shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <AlertTriangle className="h-6 w-6 text-yellow-500" />
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