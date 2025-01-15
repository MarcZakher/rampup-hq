import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";

interface TrainingModuleListProps {
  onEdit: (module: any) => void;
  onDelete: (id: string) => void;
}

export function TrainingModuleList({ onEdit, onDelete }: TrainingModuleListProps) {
  const { data: modules, isLoading } = useQuery({
    queryKey: ["trainingModules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("training_journey_modules")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Period</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Platform</TableHead>
            <TableHead>Sort Order</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {modules?.map((module) => (
            <TableRow key={module.id}>
              <TableCell>{module.title}</TableCell>
              <TableCell>Month {module.period.split("_")[1]}</TableCell>
              <TableCell>{module.duration}</TableCell>
              <TableCell>{module.platform}</TableCell>
              <TableCell>{module.sort_order}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(module)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(module.id)}
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
  );
}