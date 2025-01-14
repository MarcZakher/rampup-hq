import { StatCard } from '@/components/Dashboard/StatCard';
import { Users, TrendingUp, Target, Trophy } from 'lucide-react';
import { MonthlyScore, TeamProgress, RepPerformance } from '@/lib/types/analytics';

interface SummaryMetricsProps {
  monthlyScores: MonthlyScore[];
  teamProgress: TeamProgress;
  topPerformer: RepPerformance;
}

export const SummaryMetrics = ({ monthlyScores, teamProgress, topPerformer }: SummaryMetricsProps) => {
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
  );
};