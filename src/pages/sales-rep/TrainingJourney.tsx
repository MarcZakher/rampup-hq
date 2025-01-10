import { CustomAppLayout } from "@/components/Layout/CustomAppLayout";
import { TrainingHeader } from "@/components/training/TrainingHeader";
import { TrainingTabs } from "@/components/training/TrainingTabs";
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { mockTrainingData } from "@/lib/data/mockTrainingData";

export default function TrainingJourney() {
  const { toast } = useToast();

  const handleStartModule = useCallback((moduleId: number) => {
    toast({
      title: "Module Started",
      description: "Your progress has been saved.",
    });
  }, [toast]);

  return (
    <CustomAppLayout>
      <div className="container mx-auto py-8">
        <TrainingHeader 
          title="Training Journey"
          description="Track your progress through the sales training program"
        />
        <TrainingTabs 
          periods={mockTrainingData.periods}
          onStartModule={handleStartModule}
        />
      </div>
    </CustomAppLayout>
  );
}