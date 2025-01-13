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

interface MonthValue {
  value: string;
  note: string;
}

interface RampingExpectation {
  id: string;
  metric: string;
  month_1: MonthValue;
  month_2: MonthValue;
  month_3: MonthValue;
  month_4: MonthValue;
  month_5: MonthValue;
  month_6: MonthValue;
}

interface RampingPeriodTableProps {
  initialData?: any[];
  isLoading?: boolean;
  error?: Error | null;
}

export function RampingPeriodTable({ initialData, isLoading: externalIsLoading, error: externalError }: RampingPeriodTableProps) {
  const [rampingData, setRampingData] = useState<RampingExpectation[]>([]);
  const [isLoading, setIsLoading] = useState(!initialData);
  const { toast } = useToast();

  const parseMonthValue = (value: any): MonthValue => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (e) {
        return { value: '', note: '' };
      }
    }
    return value || { value: '', note: '' };
  };

  useEffect(() => {
    if (initialData) {
      try {
        const parsedData = initialData.map(item => ({
          id: item.id,
          metric: item.metric,
          month_1: parseMonthValue(item.month_1),
          month_2: parseMonthValue(item.month_2),
          month_3: parseMonthValue(item.month_3),
          month_4: parseMonthValue(item.month_4),
          month_5: parseMonthValue(item.month_5),
          month_6: parseMonthValue(item.month_6),
        }));
        setRampingData(parsedData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error parsing data:', error);
        toast({
          title: "Error",
          description: "Failed to parse ramping expectations data",
          variant: "destructive",
        });
      }
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

      const parsedData = data.map(item => ({
        id: item.id,
        metric: item.metric,
        month_1: parseMonthValue(item.month_1),
        month_2: parseMonthValue(item.month_2),
        month_3: parseMonthValue(item.month_3),
        month_4: parseMonthValue(item.month_4),
        month_5: parseMonthValue(item.month_5),
        month_6: parseMonthValue(item.month_6),
      }));

      setRampingData(parsedData);
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

  return (
    <div className="w-full">
      <div className="text-2xl font-semibold text-center mb-6">
        Expectations during the Ramping Period
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] bg-gray-700 text-white">
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
              <TableCell className="font-medium bg-gray-700 text-white">
                {row.metric}
              </TableCell>
              {[1, 2, 3, 4, 5, 6].map((month) => {
                const monthKey = `month_${month}` as keyof RampingExpectation;
                const monthData = row[monthKey] as MonthValue;

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