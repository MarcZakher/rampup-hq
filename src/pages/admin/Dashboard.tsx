import { CustomAppLayout } from "@/components/Layout/CustomAppLayout";
import { TrainingModuleManager } from "@/components/admin/TrainingModuleManager";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function AdminDashboard() {
  // Fetch training modules
  const { data: trainingModules, isLoading: isTrainingLoading } = useQuery({
    queryKey: ['training-modules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("training_modules")
        .select("*")
        .order("period_id, sort_order");
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <CustomAppLayout>
      <div className="container mx-auto py-8 space-y-12">
        <div>
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
          <div className="bg-white rounded-lg shadow-md p-6">
            {isTrainingLoading ? (
              <div>Loading training modules...</div>
            ) : (
              <TrainingModuleManager />
            )}
          </div>
        </div>
      </div>
    </CustomAppLayout>
  );
}