import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Trash2, UserPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@supabase/auth-helpers-react';

interface SalesRep {
  id: number;
  name: string;
  month1: number[];
  month2: number[];
  month3: number[];
}

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

const ManagerDashboard = () => {
  const [salesReps, setSalesReps] = useState<SalesRep[]>([]);
  const [newRepName, setNewRepName] = useState('');
  const { toast } = useToast();
  const user = useUser();

  // Load sales reps data for the current manager
  useEffect(() => {
    const fetchSalesReps = async () => {
      if (!user) return;

      try {
        // Get sales reps managed by the current manager
        const { data: userRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('manager_id', user.id)
          .eq('role', 'sales_rep');

        if (rolesError) throw rolesError;

        if (!userRoles.length) {
          setSalesReps([]);
          return;
        }

        // Get profiles for the sales reps
        const salesRepIds = userRoles.map(role => role.user_id);
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', salesRepIds);

        if (profilesError) throw profilesError;

        // Get assessment scores for the sales reps
        const { data: scores, error: scoresError } = await supabase
          .from('assessment_scores')
          .select('*')
          .in('sales_rep_id', salesRepIds);

        if (scoresError) throw scoresError;

        // Transform the data into the required format
        const formattedReps = profiles.map(profile => {
          const repScores = scores.filter(score => score.sales_rep_id === profile.id);
          
          const month1Scores = new Array(5).fill(0);
          const month2Scores = new Array(6).fill(0);
          const month3Scores = new Array(6).fill(0);

          repScores.forEach(score => {
            if (score.month === 'month1' && score.assessment_index < 5) {
              month1Scores[score.assessment_index] = score.score || 0;
            } else if (score.month === 'month2' && score.assessment_index < 6) {
              month2Scores[score.assessment_index] = score.score || 0;
            } else if (score.month === 'month3' && score.assessment_index < 6) {
              month3Scores[score.assessment_index] = score.score || 0;
            }
          });

          return {
            id: parseInt(profile.id),
            name: profile.full_name || 'Unknown',
            month1: month1Scores,
            month2: month2Scores,
            month3: month3Scores
          };
        });

        setSalesReps(formattedReps);
      } catch (error) {
        console.error('Error fetching sales reps:', error);
        toast({
          title: "Error",
          description: "Failed to load sales representatives data",
          variant: "destructive"
        });
      }
    };

    fetchSalesReps();
  }, [user, toast]);

  const addSalesRep = async () => {
    if (!newRepName.trim() || !user) {
      toast({
        title: "Error",
        description: "Please enter a name for the sales representative",
        variant: "destructive"
      });
      return;
    }

    try {
      // Generate a UUID for the new profile
      const newProfileId = crypto.randomUUID();

      // Create a new user profile with the generated ID
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: newProfileId,
          full_name: newRepName,
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // Create user role for the new sales rep
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert([
          {
            user_id: newProfileId,
            role: 'sales_rep',
            manager_id: user.id
          }
        ]);

      if (roleError) throw roleError;

      // Add the new rep to the local state
      const newRep: SalesRep = {
        id: parseInt(newProfileId),
        name: newRepName,
        month1: new Array(assessments.month1.length).fill(0),
        month2: new Array(assessments.month2.length).fill(0),
        month3: new Array(assessments.month3.length).fill(0)
      };

      setSalesReps([...salesReps, newRep]);
      setNewRepName('');
      toast({
        title: "Success",
        description: "Sales representative added successfully"
      });
    } catch (error) {
      console.error('Error adding sales rep:', error);
      toast({
        title: "Error",
        description: "Failed to add sales representative",
        variant: "destructive"
      });
    }
  };

  const removeSalesRep = async (id: number) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', id.toString())
        .eq('manager_id', user?.id);

      if (error) throw error;

      setSalesReps(salesReps.filter(rep => rep.id !== id));
      toast({
        title: "Success",
        description: "Sales representative removed successfully"
      });
    } catch (error) {
      console.error('Error removing sales rep:', error);
      toast({
        title: "Error",
        description: "Failed to remove sales representative",
        variant: "destructive"
      });
    }
  };

  const updateScore = async (
    repId: number,
    month: 'month1' | 'month2' | 'month3',
    index: number,
    value: string
  ) => {
    const score = parseFloat(value);
    if (isNaN(score) || score < 0 || score > 5) {
      toast({
        title: "Error",
        description: "Please enter a valid score between 0 and 5",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('assessment_scores')
        .upsert({
          sales_rep_id: repId.toString(),
          manager_id: user?.id,
          month,
          assessment_index: index,
          score
        }, {
          onConflict: 'sales_rep_id,month,assessment_index'
        });

      if (error) throw error;

      setSalesReps(salesReps.map(rep => {
        if (rep.id === repId) {
          const newScores = [...rep[month]];
          newScores[index] = score;
          return { ...rep, [month]: newScores };
        }
        return rep;
      }));
    } catch (error) {
      console.error('Error updating score:', error);
      toast({
        title: "Error",
        description: "Failed to update score",
        variant: "destructive"
      });
    }
  };

  const getScoreColor = (score: number) => {
    if (score === 0) return 'bg-white';
    if (score >= 4) return 'bg-[#90EE90]';
    if (score >= 3) return 'bg-[#FFEB9C]';
    return 'bg-[#FFC7CE]';
  };

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
            <Button onClick={addSalesRep}>
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
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesReps.map((rep) => (
                      <TableRow key={rep.id}>
                        <TableCell className="font-medium">{rep.name}</TableCell>
                        {rep[month as keyof Pick<SalesRep, 'month1' | 'month2' | 'month3'>].map((score, scoreIndex) => (
                          <TableCell key={scoreIndex} className={getScoreColor(score)}>
                            <Input
                              type="number"
                              min="0"
                              max="5"
                              step="0.5"
                              value={score || ''}
                              onChange={(e) => updateScore(rep.id, month as 'month1' | 'month2' | 'month3', scoreIndex, e.target.value)}
                              className="w-16 text-center"
                            />
                          </TableCell>
                        ))}
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeSalesRep(rep.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
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