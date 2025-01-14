import { useEffect, useState } from 'react';
import { Users, TrendingUp, Target, Trophy } from 'lucide-react';
import { CustomAppLayout } from '@/components/Layout/CustomAppLayout';
import { StatCard } from '@/components/Dashboard/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SalesRep {
  id: string;
  name: string;
  scores: {
    month1: number[];
    month2: number[];
    month3: number[];
  };
}

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

const DirectorDashboard = () => {
  const [salesReps, setSalesReps] = useState<SalesRep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSalesReps = async () => {
      try {
        // Fetch all sales reps (users with sales_rep role)
        const { data: salesRepsData, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'sales_rep');

        if (rolesError) throw rolesError;

        if (!salesRepsData) {
          setSalesReps([]);
          return;
        }

        // Fetch profiles for all sales reps
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', salesRepsData.map(rep => rep.user_id));

        if (profilesError) throw profilesError;

        // Fetch assessment scores for all sales reps
        const { data: scores, error: scoresError } = await supabase
          .from('assessment_scores')
          .select('*')
          .in('sales_rep_id', salesRepsData.map(rep => rep.user_id));

        if (scoresError) throw scoresError;

        // Process and combine the data
        const processedReps = profiles.map(profile => {
          const repScores = scores.filter(score => score.sales_rep_id === profile.id);
          
          const monthScores = {
            month1: new Array(5).fill(0),
            month2: new Array(6).fill(0),
            month3: new Array(6).fill(0)
          };

          repScores.forEach(score => {
            const month = score.month as keyof typeof monthScores;
            if (monthScores[month] && score.assessment_index !== null) {
              monthScores[month][score.assessment_index] = Number(score.score) || 0;
            }
          });

          return {
            id: profile.id,
            name: profile.full_name || 'Unknown',
            scores: monthScores
          };
        });

        setSalesReps(processedReps);
      } catch (error) {
        console.error('Error fetching sales reps data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load sales representatives data"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSalesReps();
  }, [toast]);

  const calculateAverage = (scores: number[]) => {
    const validScores = scores.filter(score => score > 0);
    if (validScores.length === 0) return 0;
    return Number((validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1));
  };

  const totalReps = salesReps.length;
  const avgScore = totalReps === 0 ? 0 : 
    Number((salesReps.reduce((acc, rep) => {
      const allScores = [...rep.scores.month1, ...rep.scores.month2, ...rep.scores.month3];
      const validScores = allScores.filter(score => score > 0);
      return acc + (validScores.length > 0 ? validScores.reduce((sum, score) => sum + score, 0) / validScores.length : 0);
    }, 0) / totalReps).toFixed(1));

  const performingWell = salesReps.filter(rep => {
    const allScores = [...rep.scores.month1, ...rep.scores.month2, ...rep.scores.month3];
    const validScores = allScores.filter(score => score > 0);
    return validScores.length > 0 && (validScores.reduce((sum, score) => sum + score, 0) / validScores.length) > 3;
  }).length;

  const getTopRampingRep = () => {
    if (salesReps.length === 0) return { name: "No reps", score: 0 };
    
    return salesReps.reduce((top, rep) => {
      const allScores = [...rep.scores.month1, ...rep.scores.month2, ...rep.scores.month3];
      const avgScore = calculateAverage(allScores);
      return avgScore > top.score ? { name: rep.name, score: avgScore } : top;
    }, { name: "", score: 0 });
  };

  const topRampingRep = getTopRampingRep();

  const getScoreColor = (score: number) => {
    if (score === 0) return 'bg-white';
    if (score >= 4) return 'bg-[#90EE90]';
    if (score >= 3) return 'bg-[#FFEB9C]';
    return 'bg-[#FFC7CE]';
  };

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

        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            title="Total Sales Reps"
            value={salesReps.length}
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
            title="Average Score"
            value={`${avgScore}/5`}
            icon={<Target className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
            title="Performing Well"
            value={performingWell}
            description="Score above 3/5"
            icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
            title="Top Ramping Rep"
            value={topRampingRep.name}
            icon={<Trophy className="h-4 w-4 text-muted-foreground" />}
          />
        </div>

        <div className="space-y-6">
          {['month1', 'month2', 'month3'].map((month, monthIndex) => (
            <Card key={month}>
              <CardHeader>
                <CardTitle>Month {monthIndex + 1} Assessments</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      {assessments[month as keyof typeof assessments].map((assessment, index) => (
                        <TableHead key={index} title={assessment.name}>
                          {assessment.shortName}
                        </TableHead>
                      ))}
                      <TableHead>Average</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesReps.map((rep) => (
                      <TableRow key={rep.id}>
                        <TableCell className="font-medium">{rep.name}</TableCell>
                        {rep.scores[month as keyof typeof rep.scores].map((score, scoreIndex) => (
                          <TableCell key={scoreIndex} className={getScoreColor(score)}>
                            {score || '-'}
                          </TableCell>
                        ))}
                        <TableCell className={getScoreColor(calculateAverage(rep.scores[month as keyof typeof rep.scores]))}>
                          {calculateAverage(rep.scores[month as keyof typeof rep.scores])}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </CustomAppLayout>
  );
};

export default DirectorDashboard;