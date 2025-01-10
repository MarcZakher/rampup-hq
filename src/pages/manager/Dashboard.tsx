import { AppLayout } from '@/components/Layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AssessmentTable } from '@/components/manager/AssessmentTable';
import { AssessmentControls } from '@/components/manager/AssessmentControls';
import { assessments } from '@/constants/assessments';
import { useSalesReps } from '@/hooks/useSalesReps';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/context/auth-context';

const ManagerDashboard = () => {
  const { salesReps, addSalesRep, removeSalesRep } = useSalesReps();
  const { toast } = useToast();
  const { user } = useAuth();

  const updateScore = async (repId: number, month: string, index: number, value: string) => {
    const score = parseFloat(value);
    if (isNaN(score) || score < 0 || score > 5 || !user) return;

    try {
      // First try to find if a record already exists
      const { data: existingScore } = await supabase
        .from('assessment_scores')
        .select()
        .eq('sales_rep_id', repId.toString())
        .eq('manager_id', user.id)
        .eq('month', month)
        .eq('assessment_index', index)
        .single();

      if (existingScore) {
        // If record exists, update it
        const { error } = await supabase
          .from('assessment_scores')
          .update({ score })
          .eq('id', existingScore.id);

        if (error) throw error;
      } else {
        // If no record exists, insert a new one
        const { error } = await supabase
          .from('assessment_scores')
          .insert({
            sales_rep_id: repId.toString(),
            manager_id: user.id,
            month,
            assessment_index: index,
            score
          });

        if (error) throw error;
      }

      // Update local storage for immediate UI feedback
      const savedReps = localStorage.getItem('manager_dashboard_sales_reps') || '{}';
      const allSavedReps = JSON.parse(savedReps);

      const updatedRep = salesReps.find(rep => rep.id === repId);
      if (updatedRep) {
        allSavedReps[repId] = {
          ...allSavedReps[repId],
          [month]: [...updatedRep[month as keyof Pick<typeof updatedRep, 'month1' | 'month2' | 'month3'>]]
        };
        allSavedReps[repId][month][index] = score;
      }

      localStorage.setItem('manager_dashboard_sales_reps', JSON.stringify(allSavedReps));

      toast({
        title: "Success",
        description: "Score updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating score:', error);
      toast({
        title: "Error",
        description: "Failed to update score",
        variant: "destructive",
      });
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        <AssessmentControls onSalesRepAdded={addSalesRep} />
        
        <div className="space-y-6">
          {['month1', 'month2', 'month3'].map((month, monthIndex) => (
            <Card key={month}>
              <CardHeader>
                <CardTitle>Month {monthIndex + 1} Assessments</CardTitle>
              </CardHeader>
              <CardContent>
                <AssessmentTable
                  month={month}
                  assessments={assessments[month]}
                  salesReps={salesReps}
                  onScoreUpdate={updateScore}
                  onRemoveSalesRep={removeSalesRep}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default ManagerDashboard;