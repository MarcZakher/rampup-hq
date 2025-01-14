import React from 'react';
import { CustomAppLayout } from '@/components/Layout/CustomAppLayout';
import { StatCard } from '@/components/Dashboard/StatCard';
import { Users, TrendingUp, Target, Trophy } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';

const Analytics = () => {
  const { data: assessmentData, isLoading } = useQuery({
    queryKey: ['assessmentScores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assessment_scores')
        .select(`
          *,
          profiles!assessment_scores_sales_rep_id_fkey(full_name)
        `);

      if (error) {
        console.error('Error fetching assessment scores:', error);
        throw error;
      }

      return data;
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
    const repScores = new Map();
    assessmentData.forEach(assessment => {
      const repName = assessment.profiles?.full_name || 'Unknown';
      const score = Number(assessment.score) || 0;
      if (!repScores.has(repName) || repScores.get(repName) < score) {
        repScores.set(repName, score);
      }
    });

    let topPerformer = { name: 'N/A', score: 0 };
    repScores.forEach((score, name) => {
      if (score > topPerformer.score) {
        topPerformer = { name, score };
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

  const summaryMetrics = [
    {
      title: "Team Average Score",
      value: `${metrics.avgScore}/5.0`,
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      description: "Across all assessments"
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
      description: `Score: ${metrics.topPerformer.score}/5`
    }
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
          <ChartContainer config={{}}>
            <AreaChart data={assessmentData}>
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

          {/* Assessment Performance */}
          <ChartContainer config={{}}>
            <BarChart data={assessmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip />
              <Bar dataKey="successRate" fill="#8884d8" name="Success Rate %" />
              <Bar dataKey="avgScore" fill="#82ca9d" name="Average Score" />
            </BarChart>
          </ChartContainer>

          {/* Areas Needing Attention */}
          <div className="w-full">
            <h3 className="text-lg font-semibold">Areas Needing Attention</h3>
            <div className="space-y-6">
              {assessmentData.map((rep, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="text-lg font-semibold">{rep.profiles?.full_name}</h3>
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
          </div>

          {/* Common Challenges */}
          <ChartContainer config={{}}>
            <BarChart 
              data={assessmentData} 
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
      </div>
    </CustomAppLayout>
  );
};

export default Analytics;
