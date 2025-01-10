import { TrainingModuleCard } from "./TrainingModuleCard";
import { TrainingPeriod as TrainingPeriodType } from "@/types/training";

interface TrainingPeriodProps {
  period: TrainingPeriodType;
  onStartModule: (moduleId: number) => void;
}

export function TrainingPeriod({ period, onStartModule }: TrainingPeriodProps) {
  return (
    <div className="grid gap-6">
      {period.modules.map((module) => (
        <TrainingModuleCard
          key={module.id}
          module={module}
          onStartModule={onStartModule}
        />
      ))}
    </div>
  );
}