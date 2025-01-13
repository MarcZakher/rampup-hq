import { useEffect, useState } from 'react';
import { CustomAppLayout } from '@/components/Layout/CustomAppLayout';
import { DirectorStats } from '@/components/Dashboard/DirectorStats';
import { AssessmentTable } from '@/components/Dashboard/AssessmentTable';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

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

interface SalesRepData {
  id: string;
  name: string;
  month1: number[];
  month2: number[];
  month3: number[];
}

const DirectorDashboard = () => {
  const [salesReps, setSalesReps] = useState<SalesRepData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const calculateAverage = (scores: number[]) => {
    const validScores = scores.filter(score => score > 0);
    if (validScores.length === 0) return 0;
    return Number((validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First fetch all sales reps by querying user_roles directly
        const { data: salesRepsData, error: salesRepsError } = await supabase
          .from('user_roles')
          .select('user_id, role')
          .eq('role', 'sales_rep');

        if (salesRepsError) throw salesRepsError;

        if (!salesRepsData || salesRepsData.length === 0) {
          setSalesReps([]);
          setIsLoading(false);
          return;
        }

        // Get all sales rep IDs
        const salesRepIds = salesRepsData.map(rep => rep.user_id).filter(Boolean);

        // Fetch profiles for these sales reps
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', salesRepIds);

        if (profilesError) throw profilesError;

        // Fetch all assessment scores
        const { data: scoresData, error: scoresError } = await supabase
          .from('assessment_scores')
          .select('*')
          .in('sales_rep_id', salesRepIds);

        if (scoresError) throw scoresError;

        // Process and organize the data
        const processedData = salesRepIds.map(repId => {
          const profile = profilesData?.find(p => p.id === repId);
          const repScores = scoresData?.filter(score => score.sales_rep_id === repId) || [];

          const getMonthScores = (month: string, length: number) => {
            return Array(length).fill(0).map((_, i) => {
              const score = repScores.find(s => s.month === month && s.assessment_index === i);
              return score?.score ? Number(score.score) : 0;
            });
          };

          return {
            id: repId,
            name: profile?.full_name || 'Unknown',
            month1: getMonthScores('month1', assessments.month1.length),
            month2: getMonthScores('month2', assessments.month2.length),
            month3: getMonthScores('month3', assessments.month3.length)
          };
        });

        setSalesReps(processedData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const totalReps = salesReps.length;
  const avgScore = totalReps === 0 ? '0.0' : (salesReps.reduce((acc, rep) => {
    const allScores = [...rep.month1, ...rep.month2, ...rep.month3];
    return acc + calculateAverage(allScores);
  }, 0) / totalReps).toFixed(1);

  const performingWell = salesReps.filter(rep => {
    const allScores = [...rep.month1, ...rep.month2, ...rep.month3];
    return calculateAverage(allScores) > 3;
  }).length;

  const topPerformer = salesReps.reduce((top, rep) => {
    const allScores = [...rep.month1, ...rep.month2, ...rep.month3];
    const avgScore = calculateAverage(allScores);
    return avgScore > top.score ? { name: rep.name, score: avgScore } : top;
  }, { name: "No reps", score: 0 });

  if (isLoading) {
    return (
      <CustomAppLayout>
        <div className="p-6">Loading...</div>
      </CustomAppLayout>
    );
  }

  return (
    <CustomAppLayout>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold">Director Dashboard</h1>
          <p className="text-muted-foreground">Sales Team Assessment Scores</p>
        </div>

        <DirectorStats
          totalReps={totalReps}
          averageScore={avgScore}
          performingWellCount={performingWell}
          topPerformer={topPerformer}
        />

        <div className="space-y-6">
          <AssessmentTable
            title="Month 1 Assessments"
            assessments={assessments.month1}
            salesReps={salesReps.map(rep => ({ id: rep.id, name: rep.name, scores: rep.month1 }))}
            calculateAverage={calculateAverage}
          />
          <AssessmentTable
            title="Month 2 Assessments"
            assessments={assessments.month2}
            salesReps={salesReps.map(rep => ({ id: rep.id, name: rep.name, scores: rep.month2 }))}
            calculateAverage={calculateAverage}
          />
          <AssessmentTable
            title="Month 3 Assessments"
            assessments={assessments.month3}
            salesReps={salesReps.map(rep => ({ id: rep.id, name: rep.name, scores: rep.month3 }))}
            calculateAverage={calculateAverage}
          />
        </div>
      </div>
    </CustomAppLayout>
  );
};

export default DirectorDashboard;