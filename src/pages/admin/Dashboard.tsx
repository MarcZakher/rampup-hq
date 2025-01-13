import { CustomAppLayout } from "@/components/Layout/CustomAppLayout";
import { RampingPeriodTable } from "@/components/RampingPeriodTable";

export default function AdminDashboard() {
  return (
    <CustomAppLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <RampingPeriodTable />
        </div>
      </div>
    </CustomAppLayout>
  );
}