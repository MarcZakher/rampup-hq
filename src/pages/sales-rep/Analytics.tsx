import { CustomAppLayout } from "@/components/Layout/CustomAppLayout";
import { TrainingProgress } from "@/components/Dashboard/TrainingProgress";
import { getSalesReps } from "@/lib/utils/analytics";
import { useEffect, useState } from "react";

// Mock logged-in user - in a real app, this would come from auth
const MOCK_LOGGED_IN_USER = "Charlie Hobbs";

interface MonthProgress {
  month: string;
  completion: number;
}

export default function SalesRepAnalytics() {
  const [monthlyProgress, setMonthlyProgress] = useState<MonthProgress[]>([]);

  useEffect(() => {
    // Get the logged-in sales rep's data
    const salesReps = getSalesReps();
    const currentRep = salesReps.find(rep => rep.name === MOCK_LOGGED_IN_USER);

    if (currentRep) {
      // Calculate completion percentages based on non-zero scores
      const month1Completion = (currentRep.month1.filter(score => score > 0).length / currentRep.month1.length) * 100;
      const month2Completion = (currentRep.month2.filter(score => score > 0).length / currentRep.month2.length) * 100;
      const month3Completion = (currentRep.month3.filter(score => score > 0).length / currentRep.month3.length) * 100;

      setMonthlyProgress([
        { month: "Month 1", completion: Math.round(month1Completion) },
        { month: "Month 2", completion: Math.round(month2Completion) },
        { month: "Month 3", completion: Math.round(month3Completion) },
        { month: "Month 4", completion: 0 }
      ]);
    }
  }, []);

  return (
    <CustomAppLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">My Analytics</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <TrainingProgress progress={monthlyProgress} />
          {/* Additional analytics content will go here */}
        </div>
      </div>
    </CustomAppLayout>
  );
}