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

const fetchRampingExpectations = async (): Promise<RampingExpectation[]> => {
  console.log("Fetching ramping expectations...");
  const { data, error } = await supabase
    .from("ramping_expectations")
    .select("*")
    .order("metric");

  if (error) {
    console.error("Error fetching ramping expectations:", error);
    throw error;
  }

  console.log("Raw data from Supabase:", data);

  if (!data || data.length === 0) {
    console.log("No data returned from Supabase");
    return [];
  }

  const mappedData = data.map((item) => ({
    metric: item.metric,
    month_1: typeof item.month_1 === 'string' ? JSON.parse(item.month_1) : item.month_1,
    month_2: typeof item.month_2 === 'string' ? JSON.parse(item.month_2) : item.month_2,
    month_3: typeof item.month_3 === 'string' ? JSON.parse(item.month_3) : item.month_3,
    month_4: typeof item.month_4 === 'string' ? JSON.parse(item.month_4) : item.month_4,
    month_5: typeof item.month_5 === 'string' ? JSON.parse(item.month_5) : item.month_5,
    month_6: typeof item.month_6 === 'string' ? JSON.parse(item.month_6) : item.month_6,
  }));

  console.log("Mapped data:", mappedData);
  return mappedData;
};

export function RampingPeriodTable() {
  const { data: expectations, isLoading, error } = useQuery({
    queryKey: ["ramping-expectations"],
    queryFn: fetchRampingExpectations,
  });

  console.log("Component render - expectations:", expectations);
  console.log("isLoading:", isLoading);
  console.log("error:", error);

  if (isLoading) {
    return (
      <div className="w-full text-center py-8">
        Loading expectations...
      </div>
    );
  }

  if (error) {
    console.error("Error details:", error);
    return (
      <div className="w-full text-center py-8 text-red-500">
        Error loading ramping expectations
      </div>
    );
  }

  if (!expectations || expectations.length === 0) {
    return (
      <div className="w-full text-center py-8">
        No ramping expectations found
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
          {expectations.map((row, index) => (
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