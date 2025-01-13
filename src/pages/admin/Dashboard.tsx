import { CustomAppLayout } from "@/components/Layout/CustomAppLayout";
import { RampingPeriodTable } from "@/components/RampingPeriodTable";
import { TrainingModuleManager } from "@/components/admin/TrainingModuleManager";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function AdminDashboard() {
  const { data: rampingData, isLoading: isRampingLoading, error: rampingError } = useQuery({
    queryKey: ['ramping-expectations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ramping_expectations")
        .select("*")
        .order("metric");
      
      if (error) throw error;
      console.log('Ramping data fetched:', data); // Debug log
      return data;
    }
  });

  const { data: trainingModules, isLoading: isTrainingLoading, error: trainingError } = useQuery({
    queryKey: ['training-modules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("training_modules")
        .select("*")
        .order("period_id, sort_order");
      
      if (error) throw error;
      console.log('Training modules fetched:', data); // Debug log
      return data;
    }
  });

  return (
    <CustomAppLayout>
      <div className="container mx-auto py-8 space-y-12">
        <div>
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
          <div className="bg-white rounded-lg shadow-md p-6">
            {rampingError ? (
              <div className="text-red-500">Error loading ramping expectations</div>
            ) : isRampingLoading ? (
              <div>Loading ramping expectations...</div>
            ) : !rampingData ? (
              <div>No ramping expectations found</div>
            ) : (
              <RampingPeriodTable initialData={rampingData} />
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {trainingError ? (
            <div className="text-red-500">Error loading training modules</div>
          ) : isTrainingLoading ? (
            <div>Loading training modules...</div>
          ) : !trainingModules ? (
            <div>No training modules found</div>
          ) : (
            <TrainingModuleManager initialData={trainingModules} />
          )}
        </div>
      </div>
    </CustomAppLayout>
  );
}