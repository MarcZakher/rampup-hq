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

export function RampingPeriodTable() {
  const [rampingData, setRampingData] = useState<RampingExpectation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRampingData();
  }, []);

  const fetchRampingData = async () => {
    try {
      const { data, error } = await supabase
        .from("ramping_expectations")
        .select("*")
        .order("metric");

      if (error) throw error;
      
      // Parse the JSON data into the correct type
      const parsedData: RampingExpectation[] = data.map(item => ({
        id: item.id,
        metric: item.metric,
        month_1: typeof item.month_1 === 'string' ? JSON.parse(item.month_1) : item.month_1,
        month_2: typeof item.month_2 === 'string' ? JSON.parse(item.month_2) : item.month_2,
        month_3: typeof item.month_3 === 'string' ? JSON.parse(item.month_3) : item.month_3,
        month_4: typeof item.month_4 === 'string' ? JSON.parse(item.month_4) : item.month_4,
        month_5: typeof item.month_5 === 'string' ? JSON.parse(item.month_5) : item.month_5,
        month_6: typeof item.month_6 === 'string' ? JSON.parse(item.month_6) : item.month_6,
      }));

      setRampingData(parsedData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch ramping expectations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
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
                  <TableCell key={month} className="text-center">
                    {monthData.value}
                    {monthData.note && (
                      <span className="text-sm text-gray-500 block">
                        {monthData.note}
                      </span>
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