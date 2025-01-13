import { Users, TrendingUp, Target, Trophy } from 'lucide-react';
import { StatCard } from '@/components/Dashboard/StatCard';

interface DirectorStatsProps {
  totalReps: number;
  averageScore: string;
  performingWellCount: number;
  topPerformer: {
    name: string;
    score: number;
  };
}

export function DirectorStats({ totalReps, averageScore, performingWellCount, topPerformer }: DirectorStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <StatCard
        title="Total Sales Reps"
        value={totalReps}
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
      />
      <StatCard
        title="Average Score"
        value={`${averageScore}/5`}
        icon={<Target className="h-4 w-4 text-muted-foreground" />}
      />
      <StatCard
        title="Performing Well"
        value={performingWellCount}
        description="Score above 3/5"
        icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
      />
      <StatCard
        title="Top Ramping Rep"
        value={topPerformer.name}
        description={`Score: ${topPerformer.score}/5`}
        icon={<Trophy className="h-4 w-4 text-muted-foreground" />}
      />
    </div>
  );
}