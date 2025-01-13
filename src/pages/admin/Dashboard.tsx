import { CustomAppLayout } from "@/components/Layout/CustomAppLayout";

export default function AdminDashboard() {
  return (
    <CustomAppLayout>
      <div className="container mx-auto py-8 space-y-12">
        <div>
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600">Welcome to the admin dashboard.</p>
          </div>
        </div>
      </div>
    </CustomAppLayout>
  );
}