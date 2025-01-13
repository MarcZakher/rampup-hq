import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";

type RampingExpectation = Database['public']['Tables']['ramping_expectations']['Row'];

interface MonthValue {
  value: string;
  note: string;
}

interface RampingPeriodTableProps {
  initialData?: RampingExpectation[];
  isLoading?: boolean;
  error?: Error | null;
}

export function RampingPeriodTable({ initialData, isLoading: externalIsLoading, error: externalError }: RampingPeriodTableProps) {
  const [rampingData, setRampingData] = useState<RampingExpectation[]>([]);
  const [isLoading, setIsLoading] = useState(!initialData);
  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      setRampingData(initialData);
      setIsLoading(false);
    } else if (!externalIsLoading) {
      fetchRampingData();
    }
  }, [initialData, externalIsLoading]);

  const fetchRampingData = async () => {
    try {
      const { data, error } = await supabase
        .from("ramping_expectations")
        .select("*")
        .order("metric");

      if (error) throw error;

      setRampingData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch ramping expectations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (externalIsLoading || isLoading) {
    return <div className="w-full text-center py-4">Loading ramping expectations...</div>;
  }

  if (externalError) {
    return <div className="w-full text-center py-4 text-red-500">Error loading ramping expectations</div>;
  }

  if (!rampingData || rampingData.length === 0) {
    return <div className="w-full text-center py-4">No ramping expectations available</div>;
  }

  const getMonthValue = (jsonData: unknown): MonthValue => {
    if (typeof jsonData === 'object' && jsonData !== null) {
      const data = jsonData as Record<string, unknown>;
      return {
        value: String(data.value || ''),
        note: String(data.note || ''),
      };
    }
    return { value: '', note: '' };
  };

  return (
    <div className="w-full">
      <div className="text-2xl font-semibold text-center mb-6">
        Expectations during the Ramping Period
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] bg-primary text-primary-foreground">
              &nbsp;
            </TableHead>
            {[1, 2, 3, 4, 5, 6].map((month) => (
              <TableHead
                key={month}
                className="text-center bg-gradient-to-r from-gray-100 to-gray-300"
              >
                Month {month}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rampingData.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium bg-primary text-primary-foreground">
                {row.metric}
              </TableCell>
              {[1, 2, 3, 4, 5, 6].map((month) => {
                const monthKey = `month_${month}` as keyof RampingExpectation;
                const monthData = getMonthValue(row[monthKey]);

                return (
                  <TableCell key={month} className="text-center p-2">
                    <div className="font-medium">{monthData.value}</div>
                    {monthData.note && (
                      <div className="text-sm text-gray-500 mt-1">
                        {monthData.note}
                      </div>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}