import { Users, TrendingUp, Target, Trophy } from 'lucide-react';
import { CustomAppLayout } from '@/components/Layout/CustomAppLayout';
import { StatCard } from '@/components/Dashboard/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { ASSESSMENTS } from '@/lib/constants/assessments';

interface SalesRep {
  id: string;
  name: string;
  month1: number[];
  month2: number[];
  month3: number[];
}

interface SalesRepQueryResult {
  user_id: string | null;
  profile: {
    id: string;
    full_name: string | null;
  } | null;
}

const fetchSalesReps = async () => {
  // First get all users with sales_rep role and their profiles
  const { data: salesRepsData, error: rolesError } = await supabase
    .from('user_roles')
    .select(`
      user_id,
      profile:profiles(
        id,
        full_name
      )
    `)
    .eq('role', 'sales_rep');

  if (rolesError) {
    console.error('Error fetching sales reps:', rolesError);
    throw rolesError;
  }

  if (!salesRepsData) {
    return [];
  }

  // Then get their assessment scores
  const salesRepsWithScores = await Promise.all(
    salesRepsData.map(async (rep) => {
      if (!rep.user_id) return null;

      const { data: scores, error: scoresError } = await supabase
        .from('assessment_scores')
        .select('*')
        .eq('sales_rep_id', rep.user_id);

      if (scoresError) {
        console.error('Error fetching scores:', scoresError);
        return null;
      }

      // Transform scores into the expected format
      const month1 = new Array(5).fill(0);
      const month2 = new Array(6).fill(0);
      const month3 = new Array(6).fill(0);

      scores?.forEach((score) => {
        if (score.month === 'month1' && score.assessment_index < 5) {
          month1[score.assessment_index] = score.score || 0;
        } else if (score.month === 'month2' && score.assessment_index < 6) {
          month2[score.assessment_index] = score.score || 0;
        } else if (score.month === 'month3' && score.assessment_index < 6) {
          month3[score.assessment_index] = score.score || 0;
        }
      });

      return {
        id: rep.user_id,
        name: rep.profile?.full_name || 'Unknown',
        month1,
        month2,
        month3
      };
    })
  );

  return salesRepsWithScores.filter((rep): rep is SalesRep => rep !== null);
};

const DirectorDashboard = () => {
  const { data: salesReps, isLoading } = useQuery({
    queryKey: ['salesReps'],
    queryFn: fetchSalesReps
  });

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

  const totalReps = salesReps?.length || 0;
  const avgScore = totalReps === 0 ? 0 : (salesReps?.reduce((acc, rep) => {
    const allScores = [...rep.month1, ...rep.month2, ...rep.month3];
    const validScores = allScores.filter(score => score > 0);
    return acc + (validScores.length > 0 ? validScores.reduce((sum, score) => sum + score, 0) / validScores.length : 0);
  }, 0) || 0 / totalReps).toFixed(1);

  const performingWell = salesReps?.filter(rep => {
    const allScores = [...rep.month1, ...rep.month2, ...rep.month3];
    const validScores = allScores.filter(score => score > 0);
    return validScores.length > 0 && (validScores.reduce((sum, score) => sum + score, 0) / validScores.length) > 3;
  }).length || 0;

  const getTopRampingRep = () => {
    if (!salesReps || salesReps.length === 0) return { name: "No reps", score: 0 };
    
    return salesReps.reduce((top, rep) => {
      const allScores = [...rep.month1, ...rep.month2, ...rep.month3];
      const avgScore = calculateAverage(allScores);
      return avgScore > top.score ? { name: rep.name, score: avgScore } : top;
    }, { name: "", score: 0 });
  };

  const topRampingRep = getTopRampingRep();

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
                    {ASSESSMENTS.month1.map((assessment, index) => (
                      <TableHead key={index} title={assessment}>{`M1-${index + 1}`}</TableHead>
                    ))}
                    <TableHead>Average</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesReps?.map((rep) => (
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
                    {ASSESSMENTS.month2.map((assessment, index) => (
                      <TableHead key={index} title={assessment}>{`M2-${index + 1}`}</TableHead>
                    ))}
                    <TableHead>Average</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesReps?.map((rep) => (
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
                    {ASSESSMENTS.month3.map((assessment, index) => (
                      <TableHead key={index} title={assessment}>{`M3-${index + 1}`}</TableHead>
                    ))}
                    <TableHead>Average</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesReps?.map((rep) => (
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