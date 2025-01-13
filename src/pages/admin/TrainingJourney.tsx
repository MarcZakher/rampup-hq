import { CustomAppLayout } from "@/components/Layout/CustomAppLayout";
import { TrainingModuleManager } from "@/components/admin/TrainingModuleManager";

export default function TrainingJourney() {
  return (
    <CustomAppLayout>
      <div className="container mx-auto py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <TrainingModuleManager />
        </div>
      </div>
    </CustomAppLayout>
  );
}