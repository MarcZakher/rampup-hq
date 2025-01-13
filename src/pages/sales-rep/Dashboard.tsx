import { RampingExpectationsTable } from "@/components/RampingExpectationsTable";
import { CustomAppLayout } from "@/components/Layout/CustomAppLayout";

export default function SalesRepDashboard() {
  return (
    <CustomAppLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Sales Representative Dashboard</h1>
        <div className="space-y-6">
          <RampingExpectationsTable />
        </div>
      </div>
    </CustomAppLayout>
  );
}