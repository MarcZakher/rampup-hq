import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Trash2, UserPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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

const initialSalesReps: SalesRep[] = [
  {
    id: 1,
    name: "Charlie Hobbs",
    month1: [1.8, 2, 0, 3, 3],
    month2: [3, 2, 2, 2, 2, 2.5],
    month3: [2.5, 2, 0, 2.5, 0, 0]
  },
  {
    id: 2,
    name: "Amina Boualem",
    month1: [4.0, 3, 3, 4, 3.5],
    month2: [3, 3, 3, 3, 3.5, 0],
    month3: [2.5, 4, 3, 2, 3.5, 3]
  },
  {
    id: 3,
    name: "Tayfun Kurtbas",
    month1: [2.3, 3, 3, 3, 3],
    month2: [3, 3, 2, 2, 3, 0],
    month3: [0, 0, 0, 0, 0, 0]
  },
  {
    id: 4,
    name: "Katrien VanHeusden",
    month1: [2.0, 0, 0, 3, 2.5],
    month2: [2, 3, 2, 3, 2, 0],
    month3: [2, 2, 1, 0, 0, 0]
  },
  {
    id: 5,
    name: "Derynne Wittes",
    month1: [2.2, 0, 3, 3, 4.5],
    month2: [0, 0, 3, 3.5, 0, 0],
    month3: [0, 0, 0, 0, 0, 0]
  },
  {
    id: 6,
    name: "Ziad Ayman",
    month1: [3.0, 0, 3, 3.25, 3.5],
    month2: [3.5, 0, 0, 4, 3.5, 4],
    month3: [0, 0, 0, 0, 0, 0]
  },
  {
    id: 7,
    name: "Karl Chayeb",
    month1: [3.5, 0, 3, 3.5, 3],
    month2: [3, 0, 3, 3.5, 0, 3.5],
    month3: [4, 0, 0, 3, 4, 0]
  },
  {
    id: 8,
    name: "Jose Konopnicki",
    month1: [4.0, 0, 3, 3.075, 3.5],
    month2: [3, 0, 4, 4, 4, 4],
    month3: [4, 0, 0, 3.5, 3.5, 0]
  },
  {
    id: 9,
    name: "Emma Hellqvist",
    month1: [3.0, 0, 0, 4, 4],
    month2: [3, 0, 3.5, 3, 3, 4],
    month3: [0, 0, 0, 4.5, 0, 0]
  },
  {
    id: 10,
    name: "Jake Curtis",
    month1: [0.0, 0, 0, 4, 0],
    month2: [0, 0, 0, 0, 0, 0],
    month3: [0, 0, 0, 0, 0, 0]
  },
  {
    id: 11,
    name: "Riccardo Profiti",
    month1: [3.5, 4, 2.5, 3.875, 3],
    month2: [3, 4, 3, 3.5, 2.25, 0],
    month3: [3, 0, 0, 4, 3.75, 0]
  }
];

const STORAGE_KEY = 'manager_dashboard_sales_reps';

const ManagerDashboard = () => {
  const [salesReps, setSalesReps] = useState<SalesRep[]>([]);
  const [newRepName, setNewRepName] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const loadSalesReps = async () => {
      try {
        // First get all sales reps under the current manager
        const { data: salesRepsData, error: salesRepsError } = await supabase
          .from('user_roles')
          .select(`
            user_id,
            profiles (
              full_name
            )
          `)
          .eq('role', 'sales_rep');

        if (salesRepsError) {
          console.error('Error fetching sales reps:', salesRepsError);
          return;
        }

        if (!salesRepsData) {
          console.log('No sales reps found');
          return;
        }

        // Then get their assessment scores
        const { data: scoresData, error: scoresError } = await supabase
          .from('assessment_scores')
          .select('*')
          .in('sales_rep_id', salesRepsData.map(rep => rep.user_id));

        if (scoresError) {
          console.error('Error fetching scores:', scoresError);
          return;
        }

        // Transform the data into the expected format
        const formattedReps = salesRepsData.map((rep, index) => {
          const repScores = scoresData?.filter(score => score.sales_rep_id === rep.user_id) || [];
          
          return {
            id: index + 1,
            name: rep.profiles?.[0]?.full_name || 'Unknown',
            month1: new Array(5).fill(0).map((_, i) => 
              repScores.find(s => s.month === 'month1' && s.assessment_index === i)?.score || 0
            ),
            month2: new Array(6).fill(0).map((_, i) => 
              repScores.find(s => s.month === 'month2' && s.assessment_index === i)?.score || 0
            ),
            month3: new Array(6).fill(0).map((_, i) => 
              repScores.find(s => s.month === 'month3' && s.assessment_index === i)?.score || 0
            )
          };
        });

        setSalesReps(formattedReps);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formattedReps));
      } catch (error) {
        console.error('Error in loadSalesReps:', error);
        // Fallback to localStorage if API fails
        const savedReps = localStorage.getItem(STORAGE_KEY);
        if (savedReps) {
          setSalesReps(JSON.parse(savedReps));
        }
      }
    };

    loadSalesReps();
  }, []);

  // Save data whenever salesReps changes
  useEffect(() => {
    try {
      if (Array.isArray(salesReps)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(salesReps));
      }
    } catch (error) {
      console.error('Error saving sales reps:', error);
    }
  }, [salesReps]);

  const addSalesRep = () => {
    if (!newRepName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for the sales representative",
        variant: "destructive"
      });
      return;
    }

    const newRep: SalesRep = {
      id: Date.now(),
      name: newRepName,
      month1: new Array(assessments.month1.length).fill(0),
      month2: new Array(assessments.month2.length).fill(0),
      month3: new Array(assessments.month3.length).fill(0)
    };

    setSalesReps(prevReps => Array.isArray(prevReps) ? [...prevReps, newRep] : [newRep]);
    setNewRepName('');
    toast({
      title: "Success",
      description: "Sales representative added successfully"
    });
  };

  const removeSalesRep = (id: number) => {
    setSalesReps(prevReps => 
      Array.isArray(prevReps) ? prevReps.filter(rep => rep.id !== id) : []
    );
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

    setSalesReps(prevReps => {
      if (!Array.isArray(prevReps)) return [];
      return prevReps.map(rep => {
        if (rep.id === repId) {
          const newScores = [...rep[month]];
          newScores[index] = score;
          return { ...rep, [month]: newScores };
        }
        return rep;
      });
    });
  };

  const getScoreColor = (score: number) => {
    if (score === 0) return 'bg-white';
    if (score >= 4) return 'bg-[#90EE90]';
    if (score >= 3) return 'bg-[#FFEB9C]';
    return 'bg-[#FFC7CE]';
  };

  // Ensure we have valid data before rendering
  const monthsToRender = ['month1', 'month2', 'month3'] as const;

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
          {monthsToRender.map((month, monthIndex) => (
            <Card key={month}>
              <CardHeader>
                <CardTitle>Month {monthIndex + 1} Assessments</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      {(assessments[month] || []).map((assessment, index) => (
                        <TableHead key={index} title={assessment.name}>
                          {assessment.shortName}
                        </TableHead>
                      ))}
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(Array.isArray(salesReps) ? salesReps : []).map((rep) => (
                      <TableRow key={rep.id}>
                        <TableCell className="font-medium">{rep.name}</TableCell>
                        {(Array.isArray(rep[month]) ? rep[month] : []).map((score, scoreIndex) => (
                          <TableCell key={scoreIndex} className={getScoreColor(score)}>
                            <Input
                              type="number"
                              min="0"
                              max="5"
                              step="0.5"
                              value={score || ''}
                              onChange={(e) => updateScore(rep.id, month, scoreIndex, e.target.value)}
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
