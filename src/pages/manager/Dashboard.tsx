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

  const loadSalesReps = async () => {
    if (!user) return;

    try {
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

      // Get the saved assessment data for each sales rep
      const savedReps = localStorage.getItem(STORAGE_KEY);
      const allSavedReps = savedReps ? JSON.parse(savedReps) : [];

      // Filter to only show reps managed by this manager
      const managedReps = allSavedReps.filter((rep: SalesRep) => 
        userRoles.some(role => role.user_id === rep.id.toString())
      );

      setSalesReps(managedReps);
    } catch (error: any) {
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

  const handleSalesRepAdded = (newRep: SalesRep) => {
    // Update local storage with the new rep
    const savedReps = localStorage.getItem(STORAGE_KEY);
    const allSavedReps = savedReps ? JSON.parse(savedReps) : [];
    const updatedReps = [...allSavedReps, newRep];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReps));

    // Update the state to show the new rep
    setSalesReps(prevReps => [...prevReps, newRep]);
  };

  const removeSalesRep = async (id: number) => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(id.toString());

      if (error) {
        toast({
          title: "Error",
          description: "Failed to remove sales representative",
          variant: "destructive"
        });
        return;
      }

      // Remove from local storage
      const savedReps = localStorage.getItem(STORAGE_KEY);
      const allSavedReps = savedReps ? JSON.parse(savedReps) : [];
      const updatedReps = allSavedReps.filter((rep: SalesRep) => rep.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReps));

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
      const savedReps = localStorage.getItem(STORAGE_KEY);
      const allSavedReps = savedReps ? JSON.parse(savedReps) : [];
      const updatedAllReps = allSavedReps.map((rep: SalesRep) => {
        const updatedRep = updatedReps.find(r => r.id === rep.id);
        return updatedRep || rep;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAllReps));

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