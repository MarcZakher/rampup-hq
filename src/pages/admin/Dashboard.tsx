import { CustomAppLayout } from "@/components/Layout/CustomAppLayout";
import { RampingExpectationsTable } from "@/components/Dashboard/RampingExpectationsTable";

export default function AdminDashboard() {
  return (
    <CustomAppLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <RampingExpectationsTable />
      </div>
    </CustomAppLayout>
  );
}