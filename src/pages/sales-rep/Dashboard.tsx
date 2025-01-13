import { ProgressTrackingTable } from "@/components/ProgressTrackingTable";
import { RampingExpectationsDisplay } from "@/components/RampingExpectationsDisplay";
import { CustomAppLayout } from "@/components/Layout/CustomAppLayout";

export default function SalesRepDashboard() {
  return (
    <CustomAppLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Sales Representative Dashboard</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <RampingExpectationsDisplay />
          <ProgressTrackingTable />
        </div>
      </div>
    </CustomAppLayout>
  );
}