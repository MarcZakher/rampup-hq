import { ProgressTrackingTable } from "@/components/ProgressTrackingTable";
import { RampingExpectationsTable } from "@/components/RampingExpectationsTable";
import { CustomAppLayout } from "@/components/Layout/CustomAppLayout";

export default function SalesRepDashboard() {
  console.log("Rendering Sales Rep Dashboard");

  return (
    <CustomAppLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Sales Representative Dashboard</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <RampingExpectationsTable />
          <ProgressTrackingTable />
        </div>
      </div>
    </CustomAppLayout>
  );
}