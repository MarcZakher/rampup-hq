import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";

interface MonthValue {
  value: string;
  note: string;
}

interface RampingExpectation {
  metric: string;
  month_1: MonthValue;
  month_2: MonthValue;
  month_3: MonthValue;
  month_4: MonthValue;
  month_5: MonthValue;
  month_6: MonthValue;
}

const fetchRampingExpectations = async () => {
  const { data, error } = await supabase
    .from("ramping_expectations")
    .select("*")
    .order("metric");

  if (error) {
    throw error;
  }

  return data.map((item) => ({
    metric: item.metric,
    month_1: typeof item.month_1 === 'string' ? JSON.parse(item.month_1) : item.month_1,
    month_2: typeof item.month_2 === 'string' ? JSON.parse(item.month_2) : item.month_2,
    month_3: typeof item.month_3 === 'string' ? JSON.parse(item.month_3) : item.month_3,
    month_4: typeof item.month_4 === 'string' ? JSON.parse(item.month_4) : item.month_4,
    month_5: typeof item.month_5 === 'string' ? JSON.parse(item.month_5) : item.month_5,
    month_6: typeof item.month_6 === 'string' ? JSON.parse(item.month_6) : item.month_6,
  }));
};

export function RampingPeriodTable() {
  const { data: expectations, isLoading, error } = useQuery({
    queryKey: ["ramping-expectations"],
    queryFn: fetchRampingExpectations,
  });

  if (isLoading) {
    return (
      <div className="w-full text-center py-8">
        Loading expectations...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full text-center py-8 text-red-500">
        Error loading ramping expectations
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="text-2xl font-semibold text-center mb-6">
        Ramping Period
      </div>
      <Table className="border border-gray-200 rounded-lg overflow-hidden">
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-[100px] bg-gray-700 text-white font-semibold">
              Metric
            </TableHead>
            {[1, 2, 3, 4, 5, 6].map((month) => (
              <TableHead
                key={month}
                className="text-center bg-gray-50 font-semibold text-gray-700"
              >
                Month {month}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {expectations?.map((row, index) => (
            <TableRow key={index} className="hover:bg-gray-50">
              <TableCell className="font-medium bg-gray-700 text-white">
                {row.metric}
              </TableCell>
              {[
                row.month_1,
                row.month_2,
                row.month_3,
                row.month_4,
                row.month_5,
                row.month_6,
              ].map((month, monthIndex) => (
                <TableCell key={monthIndex} className="text-center p-2">
                  <div>
                    <span className="font-semibold text-gray-900">
                      {month.value}
                    </span>
                    {month.note && (
                      <span className="text-sm text-gray-500 block">
                        {month.note}
                      </span>
                    )}
                  </div>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}