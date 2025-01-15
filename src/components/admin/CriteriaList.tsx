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
import { Edit, Trash } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CriteriaForm, CriteriaFormData } from "./CriteriaForm";

interface Criteria {
  id: string;
  title: string;
  description: string | null;
}

interface CriteriaListProps {
  criteria: Criteria[];
  onEdit: (criteria: Criteria) => void;
  onDelete: (id: string) => void;
  onAdd: (data: CriteriaFormData) => void;
  selectedAssessment?: { id: string; title: string } | null;
}

export function CriteriaList({ 
  criteria, 
  onEdit, 
  onDelete, 
  onAdd,
  selectedAssessment 
}: CriteriaListProps) {
  const [isAddingCriteria, setIsAddingCriteria] = React.useState(false);
  const [editingCriteria, setEditingCriteria] = React.useState<Criteria | null>(null);

  const handleEdit = (criteria: Criteria) => {
    setEditingCriteria(criteria);
    onEdit(criteria);
  };

  const handleAdd = (data: CriteriaFormData) => {
    onAdd(data);
    setIsAddingCriteria(false);
  };

  const handleCancel = () => {
    setIsAddingCriteria(false);
    setEditingCriteria(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {selectedAssessment 
            ? `Criteria for ${selectedAssessment.title}`
            : "Select an assessment to manage criteria"}
        </h3>
        {selectedAssessment && (
          <Button onClick={() => setIsAddingCriteria(true)}>
            Add Criteria
          </Button>
        )}
      </div>

      {criteria.length > 0 ? (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {criteria.map((criterion) => (
                <TableRow key={criterion.id}>
                  <TableCell>{criterion.title}</TableCell>
                  <TableCell>{criterion.description}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(criterion)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(criterion.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : selectedAssessment ? (
        <div className="text-center py-8 text-muted-foreground">
          No criteria added yet. Click "Add Criteria" to get started.
        </div>
      ) : null}

      <Sheet 
        open={isAddingCriteria || !!editingCriteria} 
        onOpenChange={(open) => {
          if (!open) handleCancel();
        }}
      >
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {editingCriteria ? "Edit Criteria" : "Add New Criteria"}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <CriteriaForm
              onSubmit={handleAdd}
              initialData={editingCriteria || undefined}
              onCancel={handleCancel}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}