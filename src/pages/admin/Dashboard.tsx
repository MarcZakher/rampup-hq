import { CustomAppLayout } from "@/components/Layout/CustomAppLayout";
import { TrainingJourneyManager } from "@/components/admin/TrainingJourneyManager";

export default function AdminDashboard() {
  return (
    <CustomAppLayout>
      <div className="container mx-auto py-8 space-y-12">
        <div>
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Training Journey Management</h2>
              <TrainingJourneyManager />
            </section>
          </div>
        </div>
      </div>
    </CustomAppLayout>
  );
}
