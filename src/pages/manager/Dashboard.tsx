import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Trash2, UserPlus } from 'lucide-react';
import { useAuth } from '@/lib/context/auth-context';
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

const STORAGE_KEY = 'manager_dashboard_sales_reps';

const ManagerDashboard = () => {
  const [salesReps, setSalesReps] = useState<SalesRep[]>([]);
  const [newRepName, setNewRepName] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();

  // Load saved data on component mount
  useEffect(() => {
    const loadSalesReps = async () => {
      if (!user) return;

      // Get sales reps managed by the current manager
      const { data: userRoles, error } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .eq('manager_id', user.id)
        .eq('role', 'sales_rep');

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load sales representatives",
          variant: "destructive"
        });
        return;
      }

      // Get the saved scores for these sales reps
      const savedReps = localStorage.getItem(STORAGE_KEY);
      const allSavedReps = savedReps ? JSON.parse(savedReps) : [];

      // Filter saved reps to only include those managed by the current manager
      const managedReps = allSavedReps.filter((rep: SalesRep) => 
        userRoles.some(role => role.user_id === rep.id.toString())
      );

      setSalesReps(managedReps);
    };

    loadSalesReps();
  }, [user, toast]);

  // Save data whenever salesReps changes
  useEffect(() => {
    const savedReps = localStorage.getItem(STORAGE_KEY);
    const allSavedReps = savedReps ? JSON.parse(savedReps) : [];

    // Update only the managed reps while preserving others
    const updatedReps = allSavedReps.map((rep: SalesRep) => {
      const managedRep = salesReps.find(r => r.id === rep.id);
      return managedRep || rep;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReps));
  }, [salesReps]);

  const addSalesRep = async () => {
    if (!newRepName.trim() || !user) {
      toast({
        title: "Error",
        description: "Please enter a name for the sales representative",
        variant: "destructive"
      });
      return;
    }

    // Create a new user account for the sales rep
    const { data: newUser, error: createError } = await supabase.auth.signUp({
      email: `${newRepName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      password: 'tempPassword123', // You should implement a secure password generation/management system
      options: {
        data: {
          role: 'sales_rep',
          manager_id: user.id
        }
      }
    });

    if (createError || !newUser.user) {
      toast({
        title: "Error",
        description: "Failed to create sales representative account",
        variant: "destructive"
      });
      return;
    }

    const newRep: SalesRep = {
      id: parseInt(newUser.user.id),
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
  };

  const removeSalesRep = async (id: number) => {
    // Remove the sales rep's user account
    const { error } = await supabase.auth.admin.deleteUser(id.toString());

    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove sales representative",
        variant: "destructive"
      });
      return;
    }

    setSalesReps(salesReps.filter(rep => rep.id !== id));
    toast({
      title: "Success",
      description: "Sales representative removed successfully"
    });
  };

  const updateScore = (repId: number, month: 'month1' | 'month2' | 'month3', index: number, value: string) => {
    const score = parseFloat(value);
    if (isNaN(score) || score < 0 || score > 5) {
      toast({
        title: "Error",
        description: "Please enter a valid score between 0 and 5",
        variant: "destructive"
      });
      return;
    }

    setSalesReps(salesReps.map(rep => {
      if (rep.id === repId) {
        const newScores = [...rep[month]];
        newScores[index] = score;
        return { ...rep, [month]: newScores };
      }
      return rep;
    }));
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
