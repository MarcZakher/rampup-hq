import { Progress } from "@/components/ui/progress";

interface MonthProgress {
  month: string;
  completion: number;
}

const monthlyProgress: MonthProgress[] = [
  { month: "Month 1", completion: 85 },
  { month: "Month 2", completion: 60 },
  { month: "Month 3", completion: 30 },
  { month: "Month 4", completion: 0 },
];

export function TrainingProgress() {
  return (
    <div className="space-y-6 mb-8">
      <h2 className="text-2xl font-bold">Training Progress</h2>
      <div className="grid gap-4">
        {monthlyProgress.map((month) => (
          <div key={month.month} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{month.month}</span>
              <span className="text-muted-foreground">{month.completion}% Complete</span>
            </div>
            <Progress value={month.completion} className="h-2" />
          </div>
        ))}
      </div>
    </div>
  );
}