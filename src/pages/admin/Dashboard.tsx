import { CustomAppLayout } from "@/components/Layout/CustomAppLayout";

export default function AdminDashboard() {
  return (
    <CustomAppLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-lg text-gray-600">
            Welcome to the Admin Dashboard. Use the sidebar menu to navigate to different sections.
          </p>
        </div>
      </div>
    </CustomAppLayout>
  );
}