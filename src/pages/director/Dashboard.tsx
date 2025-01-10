import { Users, TrendingUp, Target, Trophy } from 'lucide-react';
import { CustomAppLayout } from '@/components/Layout/CustomAppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatCard } from '@/components/Dashboard/StatCard';
import { AIInsights } from '@/components/Analytics/AIInsights';

const salesData = [
  { name: 'Alice', month1: [80, 90, 85], month2: [70, 75, 80], month3: [90, 95, 100], manager: 'Bob' },
  { name: 'Bob', month1: [60, 70, 65], month2: [80, 85, 90], month3: [70, 75, 80], manager: 'Charlie' },
  { name: 'Charlie', month1: [90, 95, 100], month2: [85, 90, 95], month3: [80, 85, 90], manager: 'Alice' },
];

const calculateAverage = (data) => {
  return data.reduce((acc, curr) => acc + curr, 0) / data.length;
};

const calculatePerformance = (salesReps) => {
  return salesReps.map(rep => ({
    name: rep.name,
    averageScore: calculateAverage([...rep.month1, ...rep.month2, ...rep.month3]),
  }));
};

export default function Dashboard() {
  const performanceData = calculatePerformance(salesData);

  return (
    <CustomAppLayout>
      <div className="space-y-6 p-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Sales Team Assessment Scores</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <StatCard title="Total Sales" value="$10,000" icon={<TrendingUp />} />
          <StatCard title="Average Score" value={calculateAverage(performanceData.map(p => p.averageScore)).toFixed(2)} icon={<Target />} />
          <StatCard title="Top Performer" value={performanceData.reduce((prev, current) => (prev.averageScore > current.averageScore) ? prev : current).name} icon={<Trophy />} />
          <StatCard title="Sales Reps" value={salesData.length} icon={<Users />} />
        </div>

        <AIInsights />

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Sales Performance Table</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Average Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {performanceData.map((rep) => (
                  <TableRow key={rep.name}>
                    <TableCell>{rep.name}</TableCell>
                    <TableCell>{rep.averageScore.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </CustomAppLayout>
  );
}
