import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import { Assessment, SalesRep } from '@/types/manager';
import { useToast } from '@/hooks/use-toast';

interface AssessmentTableProps {
  month: string;
  assessments: Assessment[];
  salesReps: SalesRep[];
  onScoreUpdate: (repId: number, month: string, index: number, value: string) => void;
  onRemoveSalesRep: (id: number) => void;
}

export const AssessmentTable = ({
  month,
  assessments,
  salesReps,
  onScoreUpdate,
  onRemoveSalesRep
}: AssessmentTableProps) => {
  const { toast } = useToast();

  const getScoreColor = (score: number) => {
    if (score === 0) return 'bg-white';
    if (score >= 4) return 'bg-[#90EE90]';
    if (score >= 3) return 'bg-[#FFEB9C]';
    return 'bg-[#FFC7CE]';
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          {assessments.map((assessment, index) => (
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
                  onChange={(e) => onScoreUpdate(rep.id, month, scoreIndex, e.target.value)}
                  className="w-16 text-center"
                />
              </TableCell>
            ))}
            <TableCell>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onRemoveSalesRep(rep.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};