import { RampingPeriodTable } from "@/components/RampingPeriodTable";
import { ProgressTrackingTable } from "@/components/ProgressTrackingTable";
import { CustomAppLayout } from "@/components/Layout/CustomAppLayout";
import { TrainingProgress } from "@/components/Dashboard/TrainingProgress";

export default function SalesRepDashboard() {
  console.log("Rendering Sales Rep Dashboard");
  
  return (
    <CustomAppLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Sales Representative Dashboard</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <TrainingProgress />
          <RampingPeriodTable />
          <ProgressTrackingTable />
        </div>
      </div>
    </CustomAppLayout>
  );
}