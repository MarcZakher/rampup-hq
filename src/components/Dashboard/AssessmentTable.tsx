import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Assessment {
  name: string;
  shortName: string;
}

interface SalesRep {
  id: string;
  name: string;
  scores: number[];
}

interface AssessmentTableProps {
  title: string;
  assessments: Assessment[];
  salesReps: SalesRep[];
  calculateAverage: (scores: number[]) => number;
}

export function AssessmentTable({ title, assessments, salesReps, calculateAverage }: AssessmentTableProps) {
  const getScoreColor = (score: number) => {
    if (score === 0) return 'bg-white';
    if (score >= 4) return 'bg-[#90EE90]';
    if (score >= 3) return 'bg-[#FFEB9C]';
    return 'bg-[#FFC7CE]';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              {assessments.map((assessment, index) => (
                <TableHead key={index} title={assessment.name}>{assessment.shortName}</TableHead>
              ))}
              <TableHead>Average</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salesReps.map((rep) => (
              <TableRow key={rep.id}>
                <TableCell className="font-medium">{rep.name}</TableCell>
                {rep.scores.map((score, index) => (
                  <TableCell key={index} className={getScoreColor(score)}>
                    {score || '-'}
                  </TableCell>
                ))}
                <TableCell className={getScoreColor(calculateAverage(rep.scores))}>
                  {calculateAverage(rep.scores)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}