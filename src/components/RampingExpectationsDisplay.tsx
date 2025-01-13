import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

type ExpectationRow = {
  id: string;
  metric: string;
  month_1: string;
  month_2: string;
  month_3: string;
  month_4: string;
  month_5: string;
  month_6: string;
};

export function RampingExpectationsDisplay() {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: expectations, isLoading } = useQuery({
    queryKey: ['ramping-expectations'],
    queryFn: async () => {
      console.log('Fetching ramping expectations...');
      
      // First, check if user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      console.log('Current user:', user);
      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }
      
      const { data, error } = await supabase
        .from('ramping_expectations')
        .select('*')
        .order('metric');
      
      if (error) {
        console.error('Error fetching expectations:', error);
        throw error;
      }
      console.log('Fetched expectations:', data);
      return data as ExpectationRow[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (expectation: ExpectationRow) => {
      console.log('Updating expectation:', expectation);
      const { error } = await supabase
        .from('ramping_expectations')
        .update({
          month_1: expectation.month_1,
          month_2: expectation.month_2,
          month_3: expectation.month_3,
          month_4: expectation.month_4,
          month_5: expectation.month_5,
          month_6: expectation.month_6,
        })
        .eq('id', expectation.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ramping-expectations'] });
      toast({
        title: "Success",
        description: "Expectations updated successfully",
      });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update expectations",
        variant: "destructive",
      });
      console.error('Update error:', error);
    },
  });

  const handleValueChange = useCallback((
    expectation: ExpectationRow,
    month: keyof Pick<ExpectationRow, 'month_1' | 'month_2' | 'month_3' | 'month_4' | 'month_5' | 'month_6'>,
    newValue: string
  ) => {
    const updatedExpectation = {
      ...expectation,
      [month]: newValue,
    };
    updateMutation.mutate(updatedExpectation);
  }, [updateMutation]);

  if (isLoading) {
    return <div>Loading expectations...</div>;
  }

  if (!expectations?.length) {
    return <div>No expectations found.</div>;
  }

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-6">
        <div className="text-2xl font-semibold">Ramping Period</div>
        <Button
          variant="outline"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] bg-gray-800 text-white">&nbsp;</TableHead>
            {[1, 2, 3, 4, 5, 6].map((month) => (
              <TableHead
                key={month}
                className="text-center bg-gradient-to-b from-gray-100 to-gray-300 font-medium"
              >
                Month {month}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {expectations.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium bg-gray-800 text-white">
                {row.metric}
              </TableCell>
              {(['month_1', 'month_2', 'month_3', 'month_4', 'month_5', 'month_6'] as const).map((month) => (
                <TableCell key={month} className="text-center p-2">
                  {isEditing ? (
                    <Input
                      type="number"
                      value={row[month]}
                      onChange={(e) => handleValueChange(row, month, e.target.value)}
                      className="w-20 mx-auto text-center"
                    />
                  ) : (
                    row[month]
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}