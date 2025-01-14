import { Users, TrendingUp, Target, Trophy } from 'lucide-react';
import { CustomAppLayout } from '@/components/Layout/CustomAppLayout';
import { StatCard } from '@/components/Dashboard/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SalesRep {
  id: string;
  name: string;
  month1: number[];
  month2: number[];
  month3: number[];
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

const calculateAverage = (scores: number[]) => {
  const validScores = scores.filter(score => score > 0);
  if (validScores.length === 0) return 0;
  return Number((validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1));
};

const getScoreColor = (score: number) => {
  if (score === 0) return 'bg-white';
  if (score >= 4) return 'bg-[#90EE90]';
  if (score >= 3) return 'bg-[#FFEB9C]';
  return 'bg-[#FFC7CE]';
};

const DirectorDashboard = () => {
  const [salesReps, setSalesReps] = useState<SalesRep[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSalesRepsData = async () => {
      try {
        // First, get all sales reps from user_roles
        const { data: salesRepsRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'sales_rep');

        if (rolesError) {
          console.error('Error fetching sales rep roles:', rolesError);
          throw rolesError;
        }

        if (!salesRepsRoles?.length) {
          console.log('No sales reps found');
          return;
        }

        // Then, get their profiles
        const userIds = salesRepsRoles.map(role => role.user_id);
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', userIds);

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          throw profilesError;
        }

        // For each sales rep, fetch their assessment scores
        const repsWithScores = await Promise.all(
          profiles.map(async (profile) => {
            const { data: scores, error: scoresError } = await supabase
              .from('assessment_scores')
              .select('month, assessment_index, score')
              .eq('sales_rep_id', profile.id)
              .order('month')
              .order('assessment_index');

            if (scoresError) {
              console.error('Error fetching scores:', scoresError);
              return null;
            }

            // Initialize score arrays
            const month1 = new Array(5).fill(0);
            const month2 = new Array(6).fill(0);
            const month3 = new Array(6).fill(0);

            // Fill in the scores
            scores?.forEach(score => {
              const monthArray = score.month === 'month1' ? month1 : 
                               score.month === 'month2' ? month2 : month3;
              monthArray[score.assessment_index] = score.score || 0;
            });

            return {
              id: profile.id,
              name: profile.full_name || 'Unknown',
              month1,
              month2,
              month3
            };
          })
        );

        const validReps = repsWithScores.filter((rep): rep is SalesRep => rep !== null);
        setSalesReps(validReps);
        console.log('Processed sales reps data:', validReps);

      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch sales representatives data",
          variant: "destructive",
        });
      }
    };

    fetchSalesRepsData();
  }, [toast]);

  const totalReps = salesReps.length;
  const avgScore = totalReps === 0 ? 0 : 
    Number((salesReps.reduce((acc, rep) => {
      const allScores = [...rep.month1, ...rep.month2, ...rep.month3];
      const validScores = allScores.filter(score => score > 0);
      return acc + (validScores.length > 0 ? validScores.reduce((sum, score) => sum + score, 0) / validScores.length : 0);
    }, 0) / totalReps).toFixed(1));

  const performingWell = salesReps.filter(rep => {
    const allScores = [...rep.month1, ...rep.month2, ...rep.month3];
    const validScores = allScores.filter(score => score > 0);
    return validScores.length > 0 && (validScores.reduce((sum, score) => sum + score, 0) / validScores.length) > 3;
  }).length;

  const getTopRampingRep = () => {
    if (salesReps.length === 0) return { name: "No reps", score: 0 };
    
    return salesReps.reduce((top, rep) => {
      const allScores = [...rep.month1, ...rep.month2, ...rep.month3];
      const avgScore = calculateAverage(allScores);
      return avgScore > top.score ? { name: rep.name, score: avgScore } : top;
    }, { name: "", score: 0 });
  };

  const topRampingRep = getTopRampingRep();

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
            value={`${calculateAverage(salesReps.flatMap(rep => [...rep.month1, ...rep.month2, ...rep.month3]))}/5`}
            icon={<Target className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
            title="Performing Well"
            value={salesReps.filter(rep => {
              const allScores = [...rep.month1, ...rep.month2, ...rep.month3];
              const validScores = allScores.filter(score => score > 0);
              return validScores.length > 0 && (validScores.reduce((sum, score) => sum + score, 0) / validScores.length) > 3;
            }).length}
            description="Score above 3/5"
            icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
            title="Top Ramping Rep"
            value={salesReps.reduce((top, rep) => {
              const allScores = [...rep.month1, ...rep.month2, ...rep.month3];
              const avgScore = calculateAverage(allScores);
              return avgScore > top.score ? { name: rep.name, score: avgScore } : top;
            }, { name: "No reps", score: 0 }).name}
            icon={<Trophy className="h-4 w-4 text-muted-foreground" />}
          />
        </div>

        <div className="space-y-6">
          {/* Month 1 */}
          <Card>
            <CardHeader>
              <CardTitle>Month 1 Assessments</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    {assessments.month1.map((assessment, index) => (
                      <TableHead key={index} title={assessment.name}>{assessment.shortName}</TableHead>
                    ))}
                    <TableHead>Average</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesReps.map((rep) => (
                    <TableRow key={rep.id}>
                      <TableCell className="font-medium">{rep.name}</TableCell>
                      {rep.month1.map((score, index) => (
                        <TableCell key={index} className={getScoreColor(score)}>
                          {score || '-'}
                        </TableCell>
                      ))}
                      <TableCell className={getScoreColor(calculateAverage(rep.month1))}>
                        {calculateAverage(rep.month1)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Month 2 */}
          <Card>
            <CardHeader>
              <CardTitle>Month 2 Assessments</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    {assessments.month2.map((assessment, index) => (
                      <TableHead key={index} title={assessment.name}>{assessment.shortName}</TableHead>
                    ))}
                    <TableHead>Average</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesReps.map((rep) => (
                    <TableRow key={rep.id}>
                      <TableCell className="font-medium">{rep.name}</TableCell>
                      {rep.month2.map((score, index) => (
                        <TableCell key={index} className={getScoreColor(score)}>
                          {score || '-'}
                        </TableCell>
                      ))}
                      <TableCell className={getScoreColor(calculateAverage(rep.month2))}>
                        {calculateAverage(rep.month2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Month 3 */}
          <Card>
            <CardHeader>
              <CardTitle>Month 3 Assessments</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    {assessments.month3.map((assessment, index) => (
                      <TableHead key={index} title={assessment.name}>{assessment.shortName}</TableHead>
                    ))}
                    <TableHead>Average</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesReps.map((rep) => (
                    <TableRow key={rep.id}>
                      <TableCell className="font-medium">{rep.name}</TableCell>
                      {rep.month3.map((score, index) => (
                        <TableCell key={index} className={getScoreColor(score)}>
                          {score || '-'}
                        </TableCell>
                      ))}
                      <TableCell className={getScoreColor(calculateAverage(rep.month3))}>
                        {calculateAverage(rep.month3)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </CustomAppLayout>
  );
};

export default DirectorDashboard;