import { Users, TrendingUp, Target, Trophy } from 'lucide-react';
import { CustomAppLayout } from '@/components/Layout/CustomAppLayout';
import { StatCard } from '@/components/Dashboard/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SalesRep {
  id: string;
  name: string;
  month1: number[];
  month2: number[];
  month3: number[];
}

const DirectorDashboard = () => {
  // Fetch sales reps
  const { data: salesReps } = useQuery({
    queryKey: ['salesReps'],
    queryFn: async () => {
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          profiles:user_id (
            full_name
          )
        `)
        .eq('role', 'sales_rep');

      if (rolesError) {
        console.error('Error fetching sales reps:', rolesError);
        return [];
      }

      return roles.map(role => ({
        id: role.user_id,
        name: role.profiles?.full_name || 'Unknown',
        month1: [],
        month2: [],
        month3: []
      }));
    }
  });

  // Fetch assessment scores
  const { data: assessmentScores } = useQuery({
    queryKey: ['assessmentScores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assessment_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching assessment scores:', error);
        return [];
      }

      return data;
    }
  });

  // Calculate statistics
  const totalReps = salesReps?.length || 0;
  const avgScore = assessmentScores?.length 
    ? (assessmentScores.reduce((acc, score) => acc + Number(score.total_score), 0) / assessmentScores.length).toFixed(1)
    : '0.0';

  const performingWell = assessmentScores?.filter(score => Number(score.total_score) > 3).length || 0;

  const getTopRampingRep = () => {
    if (!salesReps?.length || !assessmentScores?.length) return { name: "No reps", score: 0 };
    
    const repScores = salesReps.map(rep => {
      const scores = assessmentScores.filter(score => score.sales_rep_id === rep.id);
      const avgScore = scores.length 
        ? scores.reduce((acc, score) => acc + Number(score.total_score), 0) / scores.length
        : 0;
      return { name: rep.name, score: avgScore };
    });

    return repScores.reduce((top, rep) => rep.score > top.score ? rep : top, { name: "", score: 0 });
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
            description={`Score: ${topRampingRep.score.toFixed(1)}/5`}
            icon={<Trophy className="h-4 w-4 text-muted-foreground" />}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Assessment Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sales Rep</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assessmentScores?.slice(0, 5).map((submission) => {
                  const rep = salesReps?.find(rep => rep.id === submission.sales_rep_id);
                  return (
                    <TableRow key={submission.id}>
                      <TableCell>{rep?.name || 'Unknown'}</TableCell>
                      <TableCell>{submission.total_score}</TableCell>
                      <TableCell>{new Date(submission.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </CustomAppLayout>
  );
};

export default DirectorDashboard;