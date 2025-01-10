import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Trash2, UserPlus } from 'lucide-react';
import { supabase } from '@/lib/supabase';

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

  useEffect(() => {
    fetchSalesReps();
  }, []);

  const fetchSalesReps = async () => {
    try {
      const { data, error } = await supabase
        .from('sales_reps')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setSalesReps(data || []);
    } catch (error) {
      console.error('Error fetching sales reps:', error);
      toast({
        title: "Error",
        description: "Failed to fetch sales representatives",
        variant: "destructive"
      });
    }
  };

  const addSalesRep = async () => {
    if (!newRepName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for the sales representative",
        variant: "destructive"
      });
      return;
    }

    try {
      const newRep = {
        name: newRepName,
        month1: new Array(assessments.month1.length).fill(0),
        month2: new Array(assessments.month2.length).fill(0),
        month3: new Array(assessments.month3.length).fill(0)
      };

      const { data, error } = await supabase
        .from('sales_reps')
        .insert([newRep])
        .select()
        .single();

      if (error) throw error;

      setSalesReps([...salesReps, data]);
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
        .from('sales_reps')
        .delete()
        .eq('id', id);

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

  const updateScore = async (repId: number, month: 'month1' | 'month2' | 'month3', index: number, value: string) => {
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
      const rep = salesReps.find(r => r.id === repId);
      if (!rep) return;

      const updatedScores = [...rep[month]];
      updatedScores[index] = score;

      const { error } = await supabase
        .from('sales_reps')
        .update({ [month]: updatedScores })
        .eq('id', repId);

      if (error) throw error;

      setSalesReps(salesReps.map(rep => {
        if (rep.id === repId) {
          return { ...rep, [month]: updatedScores };
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
                        {rep[month as keyof typeof assessments].map((score, scoreIndex) => (
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
