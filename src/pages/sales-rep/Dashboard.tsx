import { useQuery } from "@tanstack/react-query";
import { ProgressTrackingTable } from "@/components/ProgressTrackingTable";
import { RampingPeriodTable } from "@/components/RampingPeriodTable";
import { CustomAppLayout } from "@/components/Layout/CustomAppLayout";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type RampingExpectation = Database['public']['Tables']['ramping_expectations']['Row'];

export default function SalesRepDashboard() {
  const { data: rampingData, isLoading, error } = useQuery({
    queryKey: ['ramping-expectations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ramping_expectations')
        .select('*')
        .order('metric');
      
      if (error) throw error;
      return data as RampingExpectation[];
    }
  });

  return (
    <CustomAppLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Sales Representative Dashboard</h1>
        <div className="space-y-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <RampingPeriodTable 
              initialData={rampingData} 
              isLoading={isLoading}
              error={error as Error | null}
            />
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <ProgressTrackingTable />
          </div>
        </div>
      </div>
    </CustomAppLayout>
  );
}