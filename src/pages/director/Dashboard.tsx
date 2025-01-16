import { Users, TrendingUp, Target, Trophy } from 'lucide-react';
import { CustomAppLayout } from '@/components/Layout/CustomAppLayout';
import { StatCard } from '@/components/Dashboard/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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

interface SalesRep {
  id: string;
  name: string;
  assessmentScores: {
    month1: number[];
    month2: number[];
    month3: number[];
  };
}

const DirectorDashboard = () => {
  const { data: salesReps = [], isLoading } = useQuery({
    queryKey: ['sales-reps-scores'],
    queryFn: async () => {
      // First get the current user's company_id
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      if (!userProfile?.company_id) throw new Error('No company_id found for user');

      const { data: salesReps, error: salesRepsError } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          profiles:user_id (
            id,
            full_name,
            email
          )
        `)
        .eq('role', 'sales_rep')
        .eq('company_id', userProfile.company_id);

      if (salesRepsError) throw salesRepsError;

      const salesRepsData = await Promise.all(
        salesReps.map(async (userRole) => {
          const { data: submissions, error: submissionsError } = await supabase
            .from('assessment_submissions')
            .select('total_score, assessment:assessments(period)')
            .eq('sales_rep_id', userRole.user_id)
            .eq('company_id', userProfile.company_id);

          if (submissionsError) throw submissionsError;

          const scores = {
            month1: new Array(assessments.month1.length).fill(0),
            month2: new Array(assessments.month2.length).fill(0),
            month3: new Array(assessments.month3.length).fill(0)
          };

          submissions?.forEach((submission) => {
            if (submission.assessment?.period) {
              const period = submission.assessment.period;
              const monthKey = period.replace('_', '') as keyof typeof scores;
              const monthIndex = parseInt(period.split('_')[1]) - 1;
              if (monthIndex >= 0 && monthIndex < scores[monthKey].length) {
                scores[monthKey][monthIndex] = submission.total_score;
              }
            }
          });

          return {
            id: userRole.user_id,
            name: userRole.profiles?.full_name || userRole.profiles?.email || 'Unknown',
            assessmentScores: scores
          };
        })
      );

      return salesRepsData.filter((rep): rep is SalesRep => rep !== null);
    }
  });

  const totalReps = salesReps.length;
  const avgScore = totalReps === 0 ? 0 : 
    Number((salesReps.reduce((acc, rep) => {
      const allScores = [
        ...rep.assessmentScores.month1,
        ...rep.assessmentScores.month2,
        ...rep.assessmentScores.month3
      ].filter(score => score > 0);
      return acc + (allScores.length > 0 ? allScores.reduce((sum, score) => sum + score, 0) / allScores.length : 0);
    }, 0) / totalReps).toFixed(1));

  const performingWell = salesReps.filter(rep => {
    const allScores = [
      ...rep.assessmentScores.month1,
      ...rep.assessmentScores.month2,
      ...rep.assessmentScores.month3
    ].filter(score => score > 0);
    return allScores.length > 0 && (allScores.reduce((sum, score) => sum + score, 0) / allScores.length) > 3;
  }).length;

  const getTopRampingRep = () => {
    if (salesReps.length === 0) return { name: "No reps", score: 0 };
    
    return salesReps.reduce((top, rep) => {
      const allScores = [
        ...rep.assessmentScores.month1,
        ...rep.assessmentScores.month2,
        ...rep.assessmentScores.month3
      ].filter(score => score > 0);
      const avgScore = allScores.length > 0 ? allScores.reduce((sum, score) => sum + score, 0) / allScores.length : 0;
      return avgScore > top.score ? { name: rep.name, score: avgScore } : top;
    }, { name: "", score: 0 });
  };

  const getScoreColor = (score: number) => {
    if (score === 0) return 'bg-white';
    if (score >= 4) return 'bg-[#90EE90]';
    if (score >= 3) return 'bg-[#FFEB9C]';
    return 'bg-[#FFC7CE]';
  };

  const topRampingRep = getTopRampingRep();

  if (isLoading) {
    return <div>Loading...</div>;
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
            description={`Score: ${topRampingRep.score.toFixed(1)}/5`}
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesReps.map((rep) => (
                      <TableRow key={rep.id}>
                        <TableCell className="font-medium">{rep.name}</TableCell>
                        {rep.assessmentScores[month as keyof typeof assessments].map((score, scoreIndex) => (
                          <TableCell key={scoreIndex} className={getScoreColor(score)}>
                            {score || '-'}
                          </TableCell>
                        ))}
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