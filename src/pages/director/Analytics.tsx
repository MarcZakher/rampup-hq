import React from 'react';
import { CustomAppLayout } from '@/components/Layout/CustomAppLayout';
import { StatCard } from '@/components/Dashboard/StatCard';
import { Users, TrendingUp, Target, Trophy } from 'lucide-react';
import { RampTrajectoryChart } from '@/components/Analytics/RampTrajectoryChart';
import { TeamRampScorecard } from '@/components/Analytics/TeamRampScorecard';
import { RampingTable } from '@/components/Analytics/RampingTable';
import { getRampingData, getTeamRampMetrics, getTargetMetrics } from '@/lib/analytics/rampingMetrics';

const AnalyticsPage = () => {
  const rampingData = getRampingData();
  const teamMetrics = getTeamRampMetrics();
  const targetMetrics = getTargetMetrics();

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

  const teamRampMetrics = [
    { label: "DM Achievement Rate", value: teamMetrics.dmAchievementRate },
    { label: "NBM Achievement Rate", value: teamMetrics.nbmAchievementRate },
    { label: "Scope+ Achievement Rate", value: teamMetrics.scopePlusAchievementRate },
    { label: "New Logo Achievement Rate", value: teamMetrics.newLogoAchievementRate }
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

        {/* Ramping Progress Table */}
        <div className="grid grid-cols-1 gap-6">
          <RampingTable
            data={rampingData.map(rep => ({
              name: rep.name,
              dmProgress: 85,
              nbmProgress: 75,
              scopePlusProgress: 80,
              newLogoProgress: 60,
              status: rep.isAtRisk ? 'at-risk' : rep.isStarPerformer ? 'exceeding' : 'on-track'
            }))}
          />
        </div>

        {/* Trajectory Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RampTrajectoryChart
            data={[
              { month: 'Month 1', actual: 5, target: 5 },
              { month: 'Month 2', actual: 12, target: 10 },
              { month: 'Month 3', actual: 18, target: 15 },
              // Add more data points...
            ]}
            metric="Discovery Meetings"
          />
          <RampTrajectoryChart
            data={[
              { month: 'Month 1', actual: 0, target: 0 },
              { month: 'Month 2', actual: 1, target: 1 },
              { month: 'Month 3', actual: 2, target: 1 },
              // Add more data points...
            ]}
            metric="New Business Meetings"
          />
        </div>

        {/* Team Ramp Scorecard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TeamRampScorecard metrics={teamRampMetrics} />
        </div>
      </div>
    </CustomAppLayout>
  );
};

export default AnalyticsPage;
