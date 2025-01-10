import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { CustomAppLayout } from '@/components/Layout/CustomAppLayout';
import { useAuth } from '@/lib/context/auth-context';
import {
  getMonthlyScores,
  getAssessmentData,
  getRepPerformance,
  getScoreDistribution,
  getTeamProgress,
  getAreasOfFocus
} from '@/lib/mockAnalyticsData';
import { StatCard } from '@/components/Dashboard/StatCard';
import { Users, TrendingUp, Target, Trophy, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area
} from 'recharts';

// Define colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AnalyticsPage = () => {
  const [monthlyScores, setMonthlyScores] = useState([]);
  const [assessmentData, setAssessmentData] = useState([]);
  const [repPerformance, setRepPerformance] = useState([]);
  const [scoreDistribution, setScoreDistribution] = useState([]);
  const [teamProgress, setTeamProgress] = useState({ meetingTarget: 0, completionRate: 0, averageImprovement: 0 });
  const [areasOfFocus, setAreasOfFocus] = useState({ repsNeedingAttention: [], commonChallenges: [] });
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const loadAnalytics = async () => {
      if (!user) return;

      try {
        const { data: userRole } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        const [
          monthlyScoresData,
          assessmentDataResult,
          repPerformanceData,
          scoreDistributionData,
          teamProgressData,
          areasOfFocusData
        ] = await Promise.all([
          getMonthlyScores(user.id, userRole?.role),
          getAssessmentData(user.id, userRole?.role),
          getRepPerformance(user.id, userRole?.role),
          getScoreDistribution(user.id, userRole?.role),
          getTeamProgress(user.id, userRole?.role),
          getAreasOfFocus(user.id, userRole?.role)
        ]);

        setMonthlyScores(monthlyScoresData);
        setAssessmentData(assessmentDataResult);
        setRepPerformance(repPerformanceData);
        setScoreDistribution(scoreDistributionData);
        setTeamProgress(teamProgressData);
        setAreasOfFocus(areasOfFocusData);
      } catch (error) {
        console.error('Error loading analytics:', error);
        toast({
          title: "Error",
          description: "Failed to load analytics data",
          variant: "destructive"
        });
      }
    };

    loadAnalytics();
  }, [user]);

  return (
    <CustomAppLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold mb-6">Performance Analytics</h1>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Team Average Score"
            value={`${monthlyScores[2]?.avgScore || '0'}/5.0`}
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
            description={`${teamProgress.averageImprovement >= 0 ? '+' : ''}${teamProgress.averageImprovement} from last month`}
          />
          <StatCard
            title="Reps Meeting Target"
            value={`${teamProgress.meetingTarget}%`}
            icon={<Target className="h-4 w-4 text-muted-foreground" />}
            description="Score above 3/5"
          />
          <StatCard
            title="Completion Rate"
            value={`${teamProgress.completionRate}%`}
            icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
            description="Of all assessments"
          />
          <StatCard
            title="Top Performer"
            value={repPerformance[0]?.name || 'N/A'}
            icon={<Trophy className="h-4 w-4 text-muted-foreground" />}
            description={`Score: ${repPerformance[0]?.overallScore || 0}/5`}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Overall Score Trends */}
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Score Trends (3 Months)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyScores}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="avgScore" stroke="#8884d8" name="Average Score" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Score Distribution */}
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Score Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={scoreDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {scoreDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Assessment Performance */}
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Assessment Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={assessmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="successRate" fill="#8884d8" name="Success Rate %" />
                <Bar dataKey="avgScore" fill="#82ca9d" name="Average Score" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Individual Performance */}
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Individual Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={repPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 5]} />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="overallScore" fill="#8884d8" name="Overall Score" />
                <Bar dataKey="improvement" fill="#82ca9d" name="Improvement" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Monthly Progress */}
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Monthly Progress</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyScores}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="improving" 
                  stackId="1"
                  stroke="#82ca9d" 
                  fill="#82ca9d" 
                  name="Improving"
                />
                <Area 
                  type="monotone" 
                  dataKey="declining" 
                  stackId="1"
                  stroke="#ff8042" 
                  fill="#ff8042" 
                  name="Declining"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Assessment Completion */}
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Assessment Completion Rates</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={assessmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="successRate" fill="#8884d8" name="Completion Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Areas of Focus Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <h2 className="text-lg font-semibold">Areas Needing Attention</h2>
            </div>
            <div className="space-y-4">
              {areasOfFocus.repsNeedingAttention.map((rep, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                  <h3 className="font-medium text-lg mb-2">{rep.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {rep.lowScoreCount} low scores (avg: {rep.averageLowScore})
                  </p>
                  <div className="space-y-2">
                    {rep.areas.map((area, areaIndex) => (
                      <div key={areaIndex} className="flex justify-between items-center text-sm">
                        <span className="text-red-500">{area.assessment}</span>
                        <span>{area.month} - Score: {area.score}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <h2 className="text-lg font-semibold">Common Challenges</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={areasOfFocus.commonChallenges}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="assessment" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#fbbf24" name="Number of Low Scores" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </CustomAppLayout>
  );
};

export default AnalyticsPage;
