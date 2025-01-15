import { AppLayout } from '@/components/Layout/AppLayout';
import { AssessmentFeedbackForm } from '@/components/feedback/AssessmentFeedbackForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SalesRep {
  id: string;
  name: string;
}

const Assessments = () => {
  const [salesReps, setSalesReps] = useState<SalesRep[]>([]);

  useEffect(() => {
    const fetchSalesReps = async () => {
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'sales_rep');

      if (userRoles) {
        const salesRepIds = userRoles.map(role => role.user_id);
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', salesRepIds);

        if (profiles) {
          setSalesReps(profiles.map(profile => ({
            id: profile.id,
            name: profile.full_name || 'Unknown'
          })));
        }
      }
    };

    fetchSalesReps();
  }, []);

  return (
    <AppLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Assessments</h1>
        <Card>
          <CardHeader>
            <CardTitle>Assessment Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <AssessmentFeedbackForm salesReps={salesReps} />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Assessments;