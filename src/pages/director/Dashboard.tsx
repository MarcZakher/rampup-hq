import { Users, TrendingUp, Target, Trophy, UserPlus } from 'lucide-react';
import { CustomAppLayout } from '@/components/Layout/CustomAppLayout';
import { StatCard } from '@/components/Dashboard/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

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

interface SalesRep {
  id: number;
  name: string;
  month1: number[];
  month2: number[];
  month3: number[];
}

const DirectorDashboard = () => {
  const [salesReps, setSalesReps] = useState<SalesRep[]>([]);

  useEffect(() => {
    const savedReps = localStorage.getItem(STORAGE_KEY);
    if (savedReps) {
      setSalesReps(JSON.parse(savedReps));
    }
  }, []);

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

  const handleAddSalesRep = () => {
    console.log('Add Sales Representative clicked');
  };

  return (
    <CustomAppLayout>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Director Dashboard</h1>
            <p className="text-muted-foreground">Sales Team Assessment Scores</p>
          </div>
          <Button onClick={handleAddSalesRep} className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Add Sales Representative
          </Button>
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
          {/* Sales Representatives Section */}
          <Card>
            <CardHeader>
              <CardTitle>Sales Representatives</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Overall Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Assessment</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesReps.map((rep) => {
                    const allScores = [...rep.month1, ...rep.month2, ...rep.month3];
                    const validScores = allScores.filter(score => score > 0);
                    const avgScore = validScores.length > 0 
                      ? (validScores.reduce((sum, score) => sum + score, 0) / validScores.length).toFixed(1)
                      : '0.0';
                    
                    return (
                      <TableRow key={rep.id}>
                        <TableCell className="font-medium">{rep.name}</TableCell>
                        <TableCell>{avgScore}/5</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            Number(avgScore) >= 4 ? 'bg-green-100 text-green-800' :
                            Number(avgScore) >= 3 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {Number(avgScore) >= 4 ? 'Excellent' :
                             Number(avgScore) >= 3 ? 'Good' :
                             'Needs Improvement'}
                          </span>
                        </TableCell>
                        <TableCell>{validScores.length > 0 ? 'Last week' : 'No assessments'}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

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
