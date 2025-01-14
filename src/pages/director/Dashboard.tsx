import { Users, TrendingUp, Target, Trophy } from 'lucide-react';
import { CustomAppLayout } from '@/components/Layout/CustomAppLayout';
import { StatCard } from '@/components/Dashboard/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const assessments = {
  month1: [
    { name: 'Discovery meeting roleplay pitch', shortName: 'Discovery' },
    { name: 'SA program', shortName: 'SA' },
    { name: 'Shadow capture', shortName: 'Shadow' },
    { name: 'Deliver 3 Proof points', shortName: 'Proof' },
    { name: 'Account Tiering on territory + Workload & Contact Researches on 2 accs', shortName: 'Tiering' }
  ],
  month2: [
    { name: 'PG plan', shortName: 'PG' },
    { name: 'SA program', shortName: 'SA' },
    { name: 'NBM Role play', shortName: 'NBM' },
    { name: '1st meeting excellence deck', shortName: '1st Meeting' },
    { name: 'Pitch/Trap setting questions versus main competitors in region: PostGre, DynamoDB..', shortName: 'Pitch' },
    { name: 'Account plan 1', shortName: 'Account' }
  ],
  month3: [
    { name: 'COM: Review of one LoS through discovery capture sheet', shortName: 'COM' },
    { name: 'SA program', shortName: 'SA' },
    { name: 'Champion plan', shortName: 'Champion' },
    { name: 'Deal review', shortName: 'Deal' },
    { name: 'TFW prep and execution', shortName: 'TFW' },
    { name: 'Pitch PS', shortName: 'Pitch PS' }
  ]
};

const STORAGE_KEY = 'manager_dashboard_sales_reps';

const calculateAverage = (scores: number[]) => {
  const validScores = scores.filter(score => score > 0);
  if (validScores.length === 0) return 0;
  return Number((validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1));
};

const getScoreColor = (score: number) => {
  if (score === 0) return 'bg-white';
  if (score >= 4) return 'bg-[#90EE90]'; // Light green
  if (score >= 3) return 'bg-[#FFEB9C]'; // Light yellow
  if (score >= 2) return 'bg-[#FFC7CE]'; // Light red
  return 'bg-[#FFC7CE]'; // Light red for lower scores
};

const DirectorDashboard = () => {
  const { toast } = useToast();
  const [salesReps, setSalesReps] = useState<any[]>([]);

  const { data: assessmentData, isLoading, error } = useQuery({
    queryKey: ['assessmentScores'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) {
        throw new Error('No active session');
      }

      const { data, error } = await supabase
        .from('assessment_scores')
        .select(`
          *,
          profiles!assessment_scores_sales_rep_id_profiles_fkey (
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching assessment scores:', error);
        toast({
          variant: "destructive",
          title: "Error fetching data",
          description: error.message
        });
        throw error;
      }

      return data;
    },
    retry: 1
  });

  useEffect(() => {
    if (assessmentData) {
      const processedData = processAssessmentData(assessmentData);
      setSalesReps(processedData);
    }
  }, [assessmentData]);

  const processAssessmentData = (data: any[]) => {
    const groupedData = data.reduce((acc: any, curr: any) => {
      const repId = curr.sales_rep_id;
      if (!acc[repId]) {
        acc[repId] = {
          id: repId,
          name: curr.profiles?.full_name || 'Unknown',
          month1: Array(5).fill(0),
          month2: Array(6).fill(0),
          month3: Array(6).fill(0)
        };
      }
      
      const monthKey = `month${curr.month}` as 'month1' | 'month2' | 'month3';
      if (acc[repId][monthKey]) {
        acc[repId][monthKey][curr.assessment_index - 1] = Number(curr.score);
      }
      
      return acc;
    }, {});

    return Object.values(groupedData);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Error loading dashboard data: {(error as Error).message}
      </div>
    );
  }

  const totalReps = salesReps.length;
  const avgScore = totalReps === 0 ? 0 : Number((salesReps.reduce((acc, rep) => {
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
            value={totalReps}
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
            description={`Score: ${topRampingRep.score}/5`}
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