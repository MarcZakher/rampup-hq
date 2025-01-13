import { CustomAppLayout } from "@/components/Layout/CustomAppLayout";
import { RampingExpectationsTable } from "@/components/Dashboard/RampingExpectationsTable";

export default function AdminDashboard() {
  return (
    <CustomAppLayout>
      <div className="container mx-auto py-8 space-y-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <RampingExpectationsTable />
        </div>
      </div>
    </CustomAppLayout>
  );
}