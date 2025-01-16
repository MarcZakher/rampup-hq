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

interface SalesRepListProps {
  onEdit: (salesRep: any) => void;
  onDelete: (id: string) => void;
}

export function SalesRepList({ onEdit, onDelete }: SalesRepListProps) {
  const { data: salesReps, isLoading } = useQuery({
    queryKey: ["salesReps"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          ),
          manager:manager_id (
            profiles (
              full_name
            )
          )
        `)
        .eq("role", "sales_rep");

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
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Manager</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {salesReps?.map((rep) => (
            <TableRow key={rep.id}>
              <TableCell>{rep.profiles?.full_name}</TableCell>
              <TableCell>{rep.profiles?.email}</TableCell>
              <TableCell>{rep.manager?.profiles?.full_name || 'Unassigned'}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(rep)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(rep.id)}
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