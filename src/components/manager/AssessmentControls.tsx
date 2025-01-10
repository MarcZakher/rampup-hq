import { Button } from '@/components/ui/button';
import { AddSalesRep } from './AddSalesRep';
import { SalesRep } from '@/types/manager';

interface AssessmentControlsProps {
  onSalesRepAdded: (rep: SalesRep) => void;
}

export const AssessmentControls = ({ onSalesRepAdded }: AssessmentControlsProps) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Manager Dashboard</h1>
      <AddSalesRep onSalesRepAdded={onSalesRepAdded} />
    </div>
  );
};