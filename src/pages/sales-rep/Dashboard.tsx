import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ASSESSMENTS } from '@/lib/constants/assessments';
import { getSalesReps } from '@/lib/utils/analytics';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const RampingExpectations = () => (
  <Card>
    <CardHeader>
      <CardTitle>Ramping Expectations</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <h3 className="font-semibold mb-2">Month 1: Foundation Building</h3>
        <p className="text-sm text-muted-foreground">
          Focus on understanding core product features, basic sales methodologies, and initial customer engagement strategies.
        </p>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Month 2: Skill Development</h3>
        <p className="text-sm text-muted-foreground">
          Advance to more complex sales scenarios, deeper product knowledge, and enhanced presentation skills.
        </p>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Month 3: Advanced Application</h3>
        <p className="text-sm text-muted-foreground">
          Master advanced sales techniques, complete certification programs, and demonstrate full sales cycle management.
        </p>
      </div>
    </CardContent>
  </Card>
);

const TrainingItems = () => {
  const months = ['month1', 'month2', 'month3'] as const;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Training Program</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="month1">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="month1">Month 1</TabsTrigger>
            <TabsTrigger value="month2">Month 2</TabsTrigger>
            <TabsTrigger value="month3">Month 3</TabsTrigger>
          </TabsList>
          {months.map((month) => (
            <TabsContent key={month} value={month}>
              <ul className="space-y-2">
                {ASSESSMENTS[month].map((assessment, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    <span>{assessment}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

const PersonalScores = () => {
  const [scores, setScores] = useState<{
    month1: number[];
    month2: number[];
    month3: number[];
  } | null>(null);

  useEffect(() => {
    // In a real application, this would fetch only the current user's scores
    // For now, we'll use the first sales rep as an example
    const allReps = getSalesReps();
    if (allReps.length > 0) {
      const currentUserScores = allReps[0];
      setScores({
        month1: currentUserScores.month1,
        month2: currentUserScores.month2,
        month3: currentUserScores.month3,
      });
    }
  }, []);

  if (!scores) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Assessment Scores</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Assessment</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Month</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(scores).map(([month, monthScores]) => 
                monthScores.map((score, index) => (
                  <TableRow key={`${month}-${index}`}>
                    <TableCell>{ASSESSMENTS[month as keyof typeof ASSESSMENTS][index]}</TableCell>
                    <TableCell>{score || 'Not yet assessed'}</TableCell>
                    <TableCell>{month.replace('month', 'Month ')}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

const SalesRepDashboard = () => {
  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2">
          <RampingExpectations />
          <TrainingItems />
        </div>
        <PersonalScores />
      </div>
    </AppLayout>
  );
};

export default SalesRepDashboard;