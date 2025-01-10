import { Users, TrendingUp, Target } from 'lucide-react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Sample data - this would come from your backend in a real application
const salesReps = [
  { id: 1, name: 'John Doe', month: 1, score: 4.5 },
  { id: 2, name: 'Jane Smith', month: 1, score: 2.5 },
  { id: 3, name: 'Mike Johnson', month: 1, score: 3.0 },
  { id: 4, name: 'Sarah Williams', month: 2, score: 4.0 },
  { id: 5, name: 'Tom Brown', month: 2, score: 2.0 },
];

const getScoreColor = (score: number) => {
  if (score > 3) return 'text-assessment-green';
  if (score === 3) return 'text-assessment-yellow';
  return 'text-assessment-red';
};

const DirectorDashboard = () => {
  const totalReps = salesReps.length;
  const avgScore = (salesReps.reduce((acc, rep) => acc + rep.score, 0) / totalReps).toFixed(1);
  const performingWell = salesReps.filter(rep => rep.score > 3).length;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Director Dashboard</h1>
          <p className="text-muted-foreground">Global overview of sales team performance</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales Reps</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalReps}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgScore}/5</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Performing Well</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performingWell}</div>
              <p className="text-xs text-muted-foreground">Score above 3/5</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Assessment Scores</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Month</TableHead>
                  <TableHead>Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesReps.map((rep) => (
                  <TableRow key={rep.id}>
                    <TableCell>{rep.name}</TableCell>
                    <TableCell>Month {rep.month}</TableCell>
                    <TableCell className={getScoreColor(rep.score)}>
                      {rep.score}/5
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default DirectorDashboard;