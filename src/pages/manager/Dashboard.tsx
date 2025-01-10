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

const ManagerDashboard = () => {
  const [salesReps, setSalesReps] = useState<SalesRep[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const loadSalesReps = async () => {
    if (!user) return;

    try {
      // First, get all sales reps managed by this manager from user_roles table
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, created_at')
        .eq('manager_id', user.id)
        .eq('role', 'sales_rep');

      if (rolesError) {
        console.error('Error fetching user roles:', rolesError);
        toast({
          title: "Error",
          description: "Failed to load sales representatives",
          variant: "destructive"
        });
        return;
      }

      if (!userRoles?.length) {
        setSalesReps([]);
        return;
      }

      // Get user details from auth.users
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error('Error fetching auth users:', authError);
        return;
      }

      // Get stored assessment data
      const savedReps = localStorage.getItem('manager_dashboard_sales_reps');
      const savedAssessments = savedReps ? JSON.parse(savedReps) : {};

      // Combine the data
      const mappedReps = userRoles.map((role) => {
        const authUser = authUsers.users.find(u => u.id === role.user_id);
        const savedData = savedAssessments[role.user_id] || {};
        
        return {
          id: role.user_id,
          name: authUser?.user_metadata?.name || 'Unknown',
          month1: savedData.month1 || new Array(5).fill(0),
          month2: savedData.month2 || new Array(6).fill(0),
          month3: savedData.month3 || new Array(6).fill(0),
        };
      });

      setSalesReps(mappedReps);
    } catch (error: any) {
      console.error('Error in loadSalesReps:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load sales representatives",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadSalesReps();
  }, [user]);

  const handleSalesRepAdded = async (newRep: SalesRep) => {
    // Update local storage
    const savedReps = localStorage.getItem('manager_dashboard_sales_reps') || '{}';
    const allSavedReps = JSON.parse(savedReps);
    allSavedReps[newRep.id] = {
      month1: newRep.month1,
      month2: newRep.month2,
      month3: newRep.month3,
    };
    localStorage.setItem('manager_dashboard_sales_reps', JSON.stringify(allSavedReps));

    // Refresh the sales reps list
    await loadSalesReps();
  };

  const removeSalesRep = async (id: number) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to remove sales representative",
          variant: "destructive"
        });
        return;
      }

      // Remove from local storage
      const savedReps = localStorage.getItem('manager_dashboard_sales_reps') || '{}';
      const allSavedReps = JSON.parse(savedReps);
      delete allSavedReps[id];
      localStorage.setItem('manager_dashboard_sales_reps', JSON.stringify(allSavedReps));

      // Update state
      setSalesReps(prevReps => prevReps.filter(rep => rep.id !== id));
      
      toast({
        title: "Success",
        description: "Sales representative removed successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove sales representative",
        variant: "destructive"
      });
    }
  };

  const updateScore = (repId: number, month: string, index: number, value: string) => {
    const score = parseFloat(value);
    if (isNaN(score) || score < 0 || score > 5) {
      toast({
        title: "Error",
        description: "Please enter a valid score between 0 and 5",
        variant: "destructive"
      });
      return;
    }

    setSalesReps(prevReps => {
      const updatedReps = prevReps.map(rep => {
        if (rep.id === repId) {
          const newScores = [...rep[month as keyof Pick<SalesRep, 'month1' | 'month2' | 'month3'>]];
          newScores[index] = score;
          return { ...rep, [month]: newScores };
        }
        return rep;
      });

      // Update local storage
      const savedReps = localStorage.getItem('manager_dashboard_sales_reps') || '{}';
      const allSavedReps = JSON.parse(savedReps);
      updatedReps.forEach(rep => {
        allSavedReps[rep.id] = {
          month1: rep.month1,
          month2: rep.month2,
          month3: rep.month3,
        };
      });
      localStorage.setItem('manager_dashboard_sales_reps', JSON.stringify(allSavedReps));

      return updatedReps;
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Manager Dashboard</h1>
          <AddSalesRep onSalesRepAdded={handleSalesRepAdded} />
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