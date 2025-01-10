import { AppLayout } from '@/components/Layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AssessmentTable } from '@/components/manager/AssessmentTable';
import { AssessmentControls } from '@/components/manager/AssessmentControls';
import { assessments } from '@/constants/assessments';
import { useSalesReps } from '@/hooks/useSalesReps';
import { useAuth } from '@/lib/context/auth-context';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const ManagerDashboard = () => {
  const { salesReps, addSalesRep, removeSalesRep, loadSalesReps } = useSalesReps();
  const { user } = useAuth();
  const { toast } = useToast();

  const updateScore = async (repId: number, month: string, index: number, value: string) => {
    const score = parseFloat(value);
    if (isNaN(score) || score < 0 || score > 5 || !user) return;

    try {
      const { error } = await supabase
        .from('assessment_scores')
        .upsert({
          sales_rep_id: repId,
          manager_id: user.id,
          month,
          assessment_index: index,
          score
        }, {
          onConflict: 'sales_rep_id,month,assessment_index'
        });

      if (error) {
        console.error('Error updating score:', error);
        toast({
          title: "Error",
          description: "Failed to update assessment score",
          variant: "destructive"
        });
        return;
      }

      // Reload sales reps to get updated scores
      loadSalesReps();

      toast({
        title: "Success",
        description: "Assessment score updated successfully"
      });
    } catch (error: any) {
      console.error('Error in updateScore:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update assessment score",
        variant: "destructive"
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