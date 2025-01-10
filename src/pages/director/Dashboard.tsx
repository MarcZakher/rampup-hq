import { Users, TrendingUp, Target, Trophy } from 'lucide-react';
import { CustomAppLayout } from '@/components/Layout/CustomAppLayout';
import { StatCard } from '@/components/Dashboard/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/auth-context';
import { assessments } from '@/constants/assessments';
import { useSalesReps } from '@/hooks/useSalesReps';
import { SalesRep } from '@/types/manager';

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
  const { user } = useAuth();
  const { salesReps } = useSalesReps();

  const totalReps = salesReps.length;
  const avgScore = totalReps === 0 ? 0 : (salesReps.reduce((acc, rep) => {
    const allScores = [...rep.month1, ...rep.month2, ...rep.month3];
    const validScores = allScores.filter(score => score > 0);
    return acc + (validScores.length > 0 ? validScores.reduce((sum, score) => sum + score, 0) / validScores.length : 0);
  }, 0) / totalReps).toFixed(1);

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