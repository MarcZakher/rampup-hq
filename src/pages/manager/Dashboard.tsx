import { useState, useEffect } from 'react';
import { AppLayout } from "@/components/Layout/AppLayout";
import { useToast } from '@/hooks/use-toast';
import { AddSalesRepForm } from '@/components/manager/AddSalesRepForm';
import { MonthlyAssessmentCard } from '@/components/manager/MonthlyAssessmentCard';

/**
 * Assessment configuration for each month
 */
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

// Storage key for persisting sales rep data
const STORAGE_KEY = 'manager_dashboard_sales_reps';

/**
 * Manager Dashboard component for tracking and managing sales representatives' assessments
 */
const ManagerDashboard = () => {
  const [salesReps, setSalesReps] = useState<any[]>([]);
  const { toast } = useToast();

  // Load saved data on component mount
  useEffect(() => {
    loadSalesReps();
  }, []);

  // Save data whenever salesReps changes
  useEffect(() => {
    saveSalesReps();
  }, [salesReps]);

  const loadSalesReps = () => {
    try {
      const savedReps = localStorage.getItem(STORAGE_KEY);
      if (savedReps) {
        const parsedReps = JSON.parse(savedReps);
        setSalesReps(Array.isArray(parsedReps) ? parsedReps : []);
      }
    } catch (error) {
      console.error('Error loading sales reps:', error);
      setSalesReps([]);
    }
  };

  const saveSalesReps = () => {
    try {
      if (Array.isArray(salesReps)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(salesReps));
      }
    } catch (error) {
      console.error('Error saving sales reps:', error);
    }
  };

  const addSalesRep = (name: string) => {
    const newRep = {
      id: Date.now(),
      name,
      month1: new Array(assessments.month1.length).fill(0),
      month2: new Array(assessments.month2.length).fill(0),
      month3: new Array(assessments.month3.length).fill(0)
    };

    setSalesReps(prevReps => Array.isArray(prevReps) ? [...prevReps, newRep] : [newRep]);
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
    setSalesReps(prevReps => {
      if (!Array.isArray(prevReps)) return [];
      return prevReps.map(rep => {
        if (rep.id === repId) {
          const newScores = [...rep[month]];
          newScores[index] = parseFloat(value);
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

  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Manager Dashboard</h1>
          <AddSalesRepForm onAddSalesRep={addSalesRep} />
        </div>

        <div className="space-y-6">
          {Object.entries(assessments).map(([month, monthAssessments], index) => (
            <MonthlyAssessmentCard
              key={month}
              monthNumber={index + 1}
              assessments={monthAssessments}
              salesReps={salesReps}
              monthKey={month}
              onUpdateScore={updateScore}
              onRemoveSalesRep={removeSalesRep}
              getScoreColor={getScoreColor}
            />
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default ManagerDashboard;