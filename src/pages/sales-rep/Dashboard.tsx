import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProgressTrackingTable } from "@/components/ProgressTrackingTable";
import { RampingExpectationsDisplay } from "@/components/RampingExpectationsDisplay";
import { CustomAppLayout } from "@/components/Layout/CustomAppLayout";
import { supabase } from "@/integrations/supabase/client";

export default function SalesRepDashboard() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/');
      }
    };

    checkAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <CustomAppLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Sales Representative Dashboard</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <RampingExpectationsDisplay />
          <ProgressTrackingTable />
        </div>
      </div>
    </CustomAppLayout>
  );
}