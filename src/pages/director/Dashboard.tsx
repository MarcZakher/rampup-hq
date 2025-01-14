import { Users, TrendingUp, Target, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CustomAppLayout } from '@/components/Layout/CustomAppLayout';
import { StatCard } from '@/components/Dashboard/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface SalesRep {
  id: string;
  full_name: string | null;
  email: string | null;
  assessment_scores?: {
    month: string;
    score: number;
  }[];
}

const DirectorDashboard = () => {
  const [salesReps, setSalesReps] = useState<SalesRep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSalesReps = async () => {
      try {
        // First, get all sales rep user roles
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'sales_rep');

        if (roleError) throw roleError;

        if (!roleData?.length) {
          setSalesReps([]);
          setIsLoading(false);
          return;
        }

        // Get profiles for all sales reps
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', roleData.map(role => role.user_id));

        if (profileError) throw profileError;

        // Get assessment scores for all sales reps
        const { data: scoresData, error: scoresError } = await supabase
          .from('assessment_scores')
          .select('sales_rep_id, month, score')
          .in('sales_rep_id', roleData.map(role => role.user_id));

        if (scoresError) throw scoresError;

        // Combine the data
        const repsWithScores = profileData.map(profile => ({
          id: profile.id,
          full_name: profile.full_name || 'Unknown',
          email: profile.email || '',
          assessment_scores: scoresData
            .filter(score => score.sales_rep_id === profile.id)
            .map(score => ({
              month: score.month,
              score: Number(score.score)
            }))
        }));

        setSalesReps(repsWithScores);
      } catch (error) {
        console.error('Error fetching sales reps:', error);
        toast({
          title: "Error",
          description: "Failed to fetch sales representatives data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSalesReps();
  }, [toast]);

  const totalReps = salesReps.length;
  const avgScore = salesReps.length === 0 ? 0 : 
    Number((salesReps.reduce((acc, rep) => {
      const scores = rep.assessment_scores || [];
      const repAvg = scores.length > 0 ? 
        scores.reduce((sum, score) => sum + score.score, 0) / scores.length : 0;
      return acc + repAvg;
    }, 0) / salesReps.length).toFixed(1));

  const performingWell = salesReps.filter(rep => {
    const scores = rep.assessment_scores || [];
    const repAvg = scores.length > 0 ? 
      scores.reduce((sum, score) => sum + score.score, 0) / scores.length : 0;
    return repAvg > 3;
  }).length;

  const topRep = salesReps.reduce((top, rep) => {
    const scores = rep.assessment_scores || [];
    const avgScore = scores.length > 0 ? 
      scores.reduce((sum, score) => sum + score.score, 0) / scores.length : 0;
    return avgScore > (top.score || 0) ? { name: rep.full_name, score: avgScore } : top;
  }, { name: "No reps", score: 0 });

  if (isLoading) {
    return (
      <CustomAppLayout>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid gap-4 md:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </CustomAppLayout>
    );
  }

  return (
    <CustomAppLayout>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold">Director Dashboard</h1>
          <p className="text-muted-foreground">Sales Team Overview</p>
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
            title="Top Performing Rep"
            value={topRep.name}
            description={`Score: ${topRep.score.toFixed(1)}/5`}
            icon={<Trophy className="h-4 w-4 text-muted-foreground" />}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sales Representatives</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Average Score</TableHead>
                  <TableHead>Assessments Completed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesReps.map((rep) => {
                  const scores = rep.assessment_scores || [];
                  const avgScore = scores.length > 0 ? 
                    scores.reduce((sum, score) => sum + score.score, 0) / scores.length : 0;

                  return (
                    <TableRow key={rep.id}>
                      <TableCell className="font-medium">{rep.full_name}</TableCell>
                      <TableCell>{rep.email}</TableCell>
                      <TableCell>{avgScore.toFixed(1)}/5</TableCell>
                      <TableCell>{scores.length}</TableCell>
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