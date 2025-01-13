import { ProgressTrackingTable } from "@/components/ProgressTrackingTable";
import { RampingPeriodTable } from "@/components/RampingPeriodTable";
import { CustomAppLayout } from "@/components/Layout/CustomAppLayout";

export default function SalesRepDashboard() {
  return (
    <CustomAppLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Sales Representative Dashboard</h1>
        <div className="bg-white rounded-lg shadow-md p-6 space-y-8">
          <RampingPeriodTable />
          <div className="mt-8">
            <ProgressTrackingTable />
          </div>
        </div>
      </div>
    </CustomAppLayout>
  );
}