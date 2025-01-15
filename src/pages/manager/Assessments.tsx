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

  const assessments = [
    { name: 'Discovery meeting roleplay pitch', shortName: 'Discovery' },
    { name: 'SA program', shortName: 'SA' },
    { name: 'Shadow capture', shortName: 'Shadow' },
    { name: 'Deliver 3 Proof points', shortName: 'Proof' },
    { name: 'Account Tiering', shortName: 'Tiering' },
    { name: 'PG plan', shortName: 'PG' },
    { name: 'NBM Role play', shortName: 'NBM' },
    { name: '1st meeting excellence deck', shortName: '1st Meeting' },
    { name: 'Pitch/Trap setting questions', shortName: 'Pitch' },
    { name: 'Account plan 1', shortName: 'Account' },
    { name: 'COM Review', shortName: 'COM' },
    { name: 'Champion plan', shortName: 'Champion' },
    { name: 'Deal review', shortName: 'Deal' },
    { name: 'TFW prep and execution', shortName: 'TFW' },
    { name: 'Pitch PS', shortName: 'Pitch PS' }
  ];

  return (
    <AppLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Assessments</h1>
        <Card>
          <CardHeader>
            <CardTitle>Assessment Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <AssessmentFeedbackForm
              salesReps={salesReps}
              assessments={assessments}
            />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Assessments;