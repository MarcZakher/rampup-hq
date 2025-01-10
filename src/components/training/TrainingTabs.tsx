import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrainingPeriod as TrainingPeriodComponent } from "./TrainingPeriod";
import { TrainingPeriod } from "@/types/training";

interface TrainingTabsProps {
  periods: TrainingPeriod[];
  onStartModule: (moduleId: number) => void;
}

export function TrainingTabs({ periods, onStartModule }: TrainingTabsProps) {
  return (
    <Tabs defaultValue="month1" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        {periods.map((period) => (
          <TabsTrigger key={period.id} value={period.id}>
            {period.name}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {periods.map((period) => (
        <TabsContent key={period.id} value={period.id}>
          <TrainingPeriodComponent
            period={period}
            onStartModule={onStartModule}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}