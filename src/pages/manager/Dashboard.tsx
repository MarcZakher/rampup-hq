import { useState, useEffect } from 'react';
import { AppLayout } from "@/components/Layout/AppLayout";
import { useToast } from '@/hooks/use-toast';
import { AddSalesRepForm } from '@/components/manager/AddSalesRepForm';
import { MonthlyAssessmentCard } from '@/components/manager/MonthlyAssessmentCard';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

const assessments = {
  month1: [
    { name: 'Discovery meeting roleplay pitch', shortName: 'Discovery' },
    { name: 'SA program', shortName: 'SA' },
    { name: 'Shadow capture', shortName: 'Shadow' },
    { name: 'Deliver 3 Proof points', shortName: 'Proof' },
    { name: 'Account Tiering', shortName: 'Tiering' }
  ],
  month2: [
    { name: 'PG plan', shortName: 'PG' },
    { name: 'SA program', shortName: 'SA' },
    { name: 'NBM Role play', shortName: 'NBM' },
    { name: '1st meeting excellence deck', shortName: '1st Meeting' },
    { name: 'Pitch/Trap setting questions', shortName: 'Pitch' },
    { name: 'Account plan 1', shortName: 'Account' }
  ],
  month3: [
    { name: 'COM Review', shortName: 'COM' },
    { name: 'SA program', shortName: 'SA' },
    { name: 'Champion plan', shortName: 'Champion' },
    { name: 'Deal review', shortName: 'Deal' },
    { name: 'TFW prep and execution', shortName: 'TFW' },
    { name: 'Pitch PS', shortName: 'Pitch PS' }
  ]
};

const ManagerDashboard = () => {
  const [salesReps, setSalesReps] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchSalesReps();
    }
  }, [user]);

  const fetchSalesReps = async () => {
    try {
      console.log('Fetching sales reps for manager:', user?.id);
      
      // First, get all sales reps for this manager
      const { data: salesRepsData, error: salesRepsError } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          role
        `)
        .eq('role', 'sales_rep')
        .eq('manager_id', user?.id);

      if (salesRepsError) {
        console.error('Error fetching sales reps:', salesRepsError);
        throw salesRepsError;
      }

      if (!salesRepsData || salesRepsData.length === 0) {
        setSalesReps([]);
        setIsLoading(false);
        return;
      }

      // Get profiles for these sales reps
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', salesRepsData.map(rep => rep.user_id));

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      // Get assessment scores
      const { data: scoresData, error: scoresError } = await supabase
        .from('assessment_scores')
        .select('*')
        .in('sales_rep_id', salesRepsData.map(rep => rep.user_id));

      if (scoresError) {
        console.error('Error fetching scores:', scoresError);
        throw scoresError;
      }

      // Combine the data
      const formattedReps = salesRepsData.map(rep => {
        const profile = profilesData?.find(p => p.id === rep.user_id);
        const repScores = scoresData?.filter(score => score.sales_rep_id === rep.user_id) || [];
        
        return {
          id: rep.user_id,
          name: profile?.full_name || 'Unknown',
          month1: new Array(assessments.month1.length).fill(0).map((_, index) => {
            const score = repScores.find(s => s.month === 'month1' && s.assessment_index === index);
            return score?.score || 0;
          }),
          month2: new Array(assessments.month2.length).fill(0).map((_, index) => {
            const score = repScores.find(s => s.month === 'month2' && s.assessment_index === index);
            return score?.score || 0;
          }),
          month3: new Array(assessments.month3.length).fill(0).map((_, index) => {
            const score = repScores.find(s => s.month === 'month3' && s.assessment_index === index);
            return score?.score || 0;
          })
        };
      });

      console.log('Formatted reps:', formattedReps);
      setSalesReps(formattedReps);
      setIsLoading(false);
    } catch (error) {
      console.error('Error in fetchSalesReps:', error);
      toast({
        title: "Error",
        description: "Failed to fetch sales representatives data",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const addSalesRep = async (name: string) => {
    await fetchSalesReps(); // Refresh the list after adding
  };

  const removeSalesRep = async (id: number) => {
    toast({
      title: "Not Implemented",
      description: "Removing sales representatives is not yet implemented",
      variant: "destructive"
    });
  };

  const updateScore = async (repId: number, month: string, index: number, value: string) => {
    try {
      const { error } = await supabase
        .from('assessment_scores')
        .upsert({
          sales_rep_id: repId.toString(),
          manager_id: user?.id,
          month,
          assessment_index: index,
          score: parseFloat(value)
        });

      if (error) throw error;

      await fetchSalesReps();

      toast({
        title: "Success",
        description: "Score updated successfully"
      });
    } catch (error) {
      console.error('Error updating score:', error);
      toast({
        title: "Error",
        description: "Failed to update score",
        variant: "destructive"
      });
    }
  };

  const getScoreColor = (score: number) => {
    if (score === 0) return 'bg-white';
    if (score >= 4) return 'bg-[#90EE90]';
    if (score >= 3) return 'bg-[#FFEB9C]';
    return 'bg-[#FFC7CE]';
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-6">Loading...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Manager Dashboard</h1>
          <AddSalesRepForm onAddSalesRep={addSalesRep} />
        </div>

        <div className="space-y-6">
          {Object.entries(assessments).map(([month, monthAssessments], index) => (
            <MonthlyAssessmentCard
              key={month}
              monthNumber={index + 1}
              assessments={monthAssessments}
              salesReps={salesReps}
              monthKey={month}
              onUpdateScore={updateScore}
              onRemoveSalesRep={removeSalesRep}
              getScoreColor={getScoreColor}
            />
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default ManagerDashboard;
