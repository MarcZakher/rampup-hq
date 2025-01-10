import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/context/auth-context';
import { supabase } from '@/lib/supabase';
import { AddSalesRep } from '@/components/manager/AddSalesRep';
import { AssessmentTable } from '@/components/manager/AssessmentTable';
import { assessments } from '@/constants/assessments';
import { SalesRep } from '@/types/manager';

const STORAGE_KEY = 'manager_dashboard_sales_reps';

const ManagerDashboard = () => {
  const [salesReps, setSalesReps] = useState<SalesRep[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const loadSalesReps = async () => {
      if (!user) return;

      const { data: userRoles, error } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .eq('manager_id', user.id)
        .eq('role', 'sales_rep');

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load sales representatives",
          variant: "destructive"
        });
        return;
      }

      const savedReps = localStorage.getItem(STORAGE_KEY);
      const allSavedReps = savedReps ? JSON.parse(savedReps) : [];

      const managedReps = allSavedReps.filter((rep: SalesRep) => 
        userRoles.some(role => role.user_id === rep.id.toString())
      );

      setSalesReps(managedReps);
    };

    loadSalesReps();
  }, [user, toast]);

  useEffect(() => {
    const savedReps = localStorage.getItem(STORAGE_KEY);
    const allSavedReps = savedReps ? JSON.parse(savedReps) : [];

    const updatedReps = allSavedReps.map((rep: SalesRep) => {
      const managedRep = salesReps.find(r => r.id === rep.id);
      return managedRep || rep;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReps));
  }, [salesReps]);

  const removeSalesRep = async (id: number) => {
    const { error } = await supabase.auth.admin.deleteUser(id.toString());

    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove sales representative",
        variant: "destructive"
      });
      return;
    }

    setSalesReps(salesReps.filter(rep => rep.id !== id));
    toast({
      title: "Success",
      description: "Sales representative removed successfully"
    });
  };

  const updateScore = (repId: number, month: 'month1' | 'month2' | 'month3', index: number, value: string) => {
    const score = parseFloat(value);
    if (isNaN(score) || score < 0 || score > 5) {
      toast({
        title: "Error",
        description: "Please enter a valid score between 0 and 5",
        variant: "destructive"
      });
      return;
    }

    setSalesReps(salesReps.map(rep => {
      if (rep.id === repId) {
        const newScores = [...rep[month]];
        newScores[index] = score;
        return { ...rep, [month]: newScores };
      }
      return rep;
    }));
  };

  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Manager Dashboard</h1>
          <AddSalesRep onSalesRepAdded={(newRep) => setSalesReps([...salesReps, newRep])} />
        </div>

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