import { useEffect } from "react";
import { useAuth } from "@/lib/context/auth-context";
import { RampingPeriodTable } from "@/components/RampingPeriodTable";
import { ProgressTrackingTable } from "@/components/ProgressTrackingTable";
import { CustomAppLayout } from "@/components/Layout/CustomAppLayout";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function SalesRepDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: userRole, isLoading: isLoadingRole } = useQuery({
    queryKey: ['userRole', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        toast({
          title: "Error",
          description: "Failed to load user role",
          variant: "destructive",
        });
        return null;
      }

      return data;
    },
    enabled: !!user?.id,
  });

  // Verify the user is a sales rep
  if (isLoadingRole) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (userRole?.role !== 'sales_rep') {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="mt-2 text-gray-600">You must be a sales representative to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <CustomAppLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Sales Representative Dashboard</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <RampingPeriodTable />
          <ProgressTrackingTable />
        </div>
      </div>
    </CustomAppLayout>
  );
}