import { AppLayout } from '@/components/Layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AssessmentTable } from '@/components/manager/AssessmentTable';
import { AssessmentControls } from '@/components/manager/AssessmentControls';
import { assessments } from '@/constants/assessments';
import { useSalesReps } from '@/hooks/useSalesReps';

const ManagerDashboard = () => {
  const { salesReps, addSalesRep, removeSalesRep } = useSalesReps();

  const updateScore = (repId: number, month: string, index: number, value: string) => {
    const score = parseFloat(value);
    if (isNaN(score) || score < 0 || score > 5) return;

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