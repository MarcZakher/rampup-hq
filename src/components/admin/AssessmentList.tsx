import React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash, Plus } from "lucide-react";

interface Assessment {
  id: string;
  title: string;
  description: string | null;
  period: string;
}

interface AssessmentListProps {
  assessments: Assessment[];
  onEdit: (assessment: Assessment) => void;
  onDelete: (id: string) => void;
  onManageCriteria: (assessment: Assessment) => void;
}

export function AssessmentList({
  assessments,
  onEdit,
  onDelete,
  onManageCriteria,
}: AssessmentListProps) {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Period</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[200px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assessments?.map((assessment) => (
            <TableRow key={assessment.id}>
              <TableCell>{assessment.title}</TableCell>
              <TableCell>Month {assessment.period.split("_")[1]}</TableCell>
              <TableCell>{assessment.description}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(assessment)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(assessment.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => onManageCriteria(assessment)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Criteria
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}