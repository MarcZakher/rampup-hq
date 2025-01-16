import { useState } from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { UserPlus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SalesRep {
  id: string;
  name: string;
  assessmentScores: {
    month1: number[];
    month2: number[];
    month3: number[];
  };
}

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

const ManagerDashboard = () => {
  const { toast } = useToast();
  const [newRepName, setNewRepName] = useState('');

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

  const getScoreColor = (score: number) => {
    if (score === 0) return 'bg-white';
    if (score >= 4) return 'bg-[#90EE90]';
    if (score >= 3) return 'bg-[#FFEB9C]';
    return 'bg-[#FFC7CE]';
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Manager Dashboard</h1>
          <div className="flex gap-4 items-center">
            <Input
              placeholder="Enter sales rep name"
              value={newRepName}
              onChange={(e) => setNewRepName(e.target.value)}
              className="w-64"
            />
            <Button onClick={() => {
              toast({
                title: "Feature coming soon",
                description: "Adding new sales reps will be available in a future update."
              });
            }}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Sales Rep
            </Button>
          </div>
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
    </AppLayout>
  );
};

export default ManagerDashboard;