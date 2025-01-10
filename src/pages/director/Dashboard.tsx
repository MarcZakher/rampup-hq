import { Users, TrendingUp, Target } from 'lucide-react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Sample data structure based on the image
const assessments = {
  month1: [
    { name: 'Discovery meeting/pitch', shortName: 'Discovery' },
    { name: 'SA program', shortName: 'SA' },
    { name: 'Shadow program', shortName: 'Shadow' },
    { name: 'Deliver 3 Proof points', shortName: 'Proof' },
    { name: 'Account Tiering on territory + Workload & Quotes/Forecasting', shortName: 'Tiering' }
  ],
  month2: [
    { name: 'PG plan', shortName: 'PG' },
    { name: 'SA program', shortName: 'SA' },
    { name: 'NMH Role play', shortName: 'NMH' },
    { name: '1st meeting excellence deck', shortName: '1st Meeting' },
    { name: 'Pitch/Trap setting questions versus main competitors in region', shortName: 'Pitch' }
  ],
  month3: [
    { name: 'Account plan', shortName: 'Account' },
    { name: 'CGW: Review of one LSS through discovery capture sheet', shortName: 'CGW' },
    { name: 'SA program', shortName: 'SA' },
    { name: 'Champion plan', shortName: 'Champion' },
    { name: 'Deal review', shortName: 'Deal' },
    { name: 'TFW prep and execution', shortName: 'TFW' },
    { name: 'Pitch PS', shortName: 'Pitch' }
  ]
};

const salesReps = [
  { 
    id: 1, 
    name: 'Charlie Hobbs',
    month1: [1.8, 2, 0, 3, 3],
    month2: [3, 2, 2, 2, 2],
    month3: [2.5, 2.5, 2, 0, 2.5, 0, 0]
  },
  { 
    id: 2, 
    name: 'Amina Boualem',
    month1: [4.0, 3, 3, 4, 3.5],
    month2: [3, 3, 3, 3, 3.5],
    month3: [0, 2.5, 4, 3, 2, 3.5, 3]
  },
  { 
    id: 3, 
    name: 'John Doe',
    month1: [3, 3, 3, 3, 3],
    month2: [4, 4, 4, 4, 4],
    month3: [2, 2, 2, 2, 2]
  },
  { 
    id: 4, 
    name: 'Jane Smith',
    month1: [2, 2, 2, 2, 2],
    month2: [3, 3, 3, 3, 3],
    month3: [4, 4, 4, 4, 4]
  },
  { 
    id: 5, 
    name: 'Mike Johnson',
    month1: [1, 1, 1, 1, 1],
    month2: [2, 2, 2, 2, 2],
    month3: [3, 3, 3, 3, 3]
  }
];

const getScoreColor = (score: number) => {
  if (score === 0) return 'bg-white';
  if (score >= 4) return 'bg-[#90EE90]'; // Light green
  if (score >= 3) return 'bg-[#FFEB9C]'; // Light yellow
  if (score >= 2) return 'bg-[#FFC7CE]'; // Light red
  return 'bg-[#FFC7CE]'; // Light red for lower scores
};

const DirectorDashboard = () => {
  const totalReps = salesReps.length;
  const avgScore = (salesReps.reduce((acc, rep) => {
    const allScores = [...rep.month1, ...rep.month2, ...rep.month3];
    const validScores = allScores.filter(score => score > 0);
    return acc + (validScores.reduce((sum, score) => sum + score, 0) / validScores.length);
  }, 0) / totalReps).toFixed(1);

  const performingWell = salesReps.filter(rep => {
    const allScores = [...rep.month1, ...rep.month2, ...rep.month3];
    const validScores = allScores.filter(score => score > 0);
    return (validScores.reduce((sum, score) => sum + score, 0) / validScores.length) > 3;
  }).length;

  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold">Director Dashboard</h1>
          <p className="text-muted-foreground">Sales Team Assessment Scores</p>
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default DirectorDashboard;
