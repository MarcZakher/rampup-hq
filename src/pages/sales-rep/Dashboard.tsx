import { useQuery } from "@tanstack/react-query";
import { RampingPeriodTable } from "@/components/RampingPeriodTable";
import { ProgressTrackingTable } from "@/components/ProgressTrackingTable";
import { CustomAppLayout } from "@/components/Layout/CustomAppLayout";
import { supabase } from "@/integrations/supabase/client";

export default function SalesRepDashboard() {
  const { data: rampingData, isLoading, error } = useQuery({
    queryKey: ['ramping-expectations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ramping_expectations")
        .select("*")
        .order("metric");
      
      if (error) throw error;
      console.log('Ramping data fetched in Sales Rep Dashboard:', data);
      return data;
    }
  });

  return (
    <CustomAppLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Sales Representative Dashboard</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          {error ? (
            <div className="text-red-500">Error loading ramping expectations</div>
          ) : (
            <RampingPeriodTable initialData={rampingData} />
          )}
          <div className="mt-8">
            <ProgressTrackingTable />
          </div>
        </div>
      </div>
    </CustomAppLayout>
  );
}