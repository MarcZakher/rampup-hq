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
      const { data: existingScore, error: queryError } = await supabase
        .from('assessment_scores')
        .select()
        .eq('sales_rep_id', repId.toString())
        .eq('manager_id', user.id)
        .eq('month', month)
        .eq('assessment_index', index)
        .maybeSingle();  // Changed from .single() to .maybeSingle()

      if (queryError) {
        console.error('Error checking existing score:', queryError);
        throw queryError;
      }

      let error;
      if (existingScore) {
        // If record exists, update it
        const { error: updateError } = await supabase
          .from('assessment_scores')
          .update({ score })
          .eq('id', existingScore.id);
        error = updateError;
      } else {
        // If no record exists, insert a new one
        const { error: insertError } = await supabase
          .from('assessment_scores')
          .insert({
            sales_rep_id: repId.toString(),
            manager_id: user.id,
            month,
            assessment_index: index,
            score
          });
        error = insertError;
      }

      if (error) throw error;

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