import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';
import { AssessmentScoreInput } from "./AssessmentScoreInput";

interface Assessment {
  name: string;
  shortName: string;
}

interface SalesRep {
  id: number;
  name: string;
  [key: string]: any;
}

interface MonthlyAssessmentCardProps {
  monthNumber: number;
  assessments: Assessment[];
  salesReps: SalesRep[];
  monthKey: string;
  onUpdateScore: (repId: number, month: string, index: number, value: string) => void;
  onRemoveSalesRep: (id: number) => void;
  getScoreColor: (score: number) => string;
}

/**
 * Card component displaying monthly assessment scores for all sales representatives
 */
export function MonthlyAssessmentCard({
  monthNumber,
  assessments,
  salesReps,
  monthKey,
  onUpdateScore,
  onRemoveSalesRep,
  getScoreColor,
}: MonthlyAssessmentCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Month {monthNumber} Assessments</CardTitle>
      </CardHeader>
      <CardContent>
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
                {rep[monthKey].map((score: number, scoreIndex: number) => (
                  <TableCell key={scoreIndex} className={getScoreColor(score)}>
                    <AssessmentScoreInput
                      score={score}
                      onChange={(value) => onUpdateScore(rep.id, monthKey, scoreIndex, value)}
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
      </CardContent>
    </Card>
  );
}