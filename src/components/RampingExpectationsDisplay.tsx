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

type MonthData = {
  value: string;
  note: string;
};

type ExpectationRow = {
  id: string;
  metric: string;
  month_1: MonthData;
  month_2: MonthData;
  month_3: MonthData;
  month_4: MonthData;
  month_5: MonthData;
  month_6: MonthData;
};

export function RampingExpectationsDisplay() {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: expectations } = useQuery({
    queryKey: ['ramping-expectations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ramping_expectations')
        .select('*');
      
      if (error) throw error;
      
      // Transform the data to match our ExpectationRow type
      return (data as any[]).map(row => ({
        id: row.id,
        metric: row.metric,
        month_1: row.month_1 as MonthData,
        month_2: row.month_2 as MonthData,
        month_3: row.month_3 as MonthData,
        month_4: row.month_4 as MonthData,
        month_5: row.month_5 as MonthData,
        month_6: row.month_6 as MonthData,
      })) as ExpectationRow[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (expectation: ExpectationRow) => {
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
    month: keyof ExpectationRow,
    newValue: string
  ) => {
    const updatedExpectation = {
      ...expectation,
      [month]: {
        ...expectation[month as keyof Pick<ExpectationRow, 'month_1' | 'month_2' | 'month_3' | 'month_4' | 'month_5' | 'month_6'>],
        value: newValue,
      },
    };
    updateMutation.mutate(updatedExpectation);
  }, [updateMutation]);

  if (!expectations?.length) {
    return <div>Loading expectations...</div>;
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
                      value={row[month].value}
                      onChange={(e) => handleValueChange(row, month, e.target.value)}
                      className="w-20 mx-auto text-center"
                    />
                  ) : (
                    row[month].value
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