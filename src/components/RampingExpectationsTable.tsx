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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

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

export function RampingExpectationsTable() {
  const { data: expectations, isLoading } = useQuery({
    queryKey: ["ramping-expectations"],
    queryFn: async () => {
      console.log("Fetching ramping expectations...");
      const { data, error } = await supabase
        .from("ramping_expectations")
        .select("*")
        .order("metric");
      
      if (error) {
        console.error("Error fetching ramping expectations:", error);
        throw error;
      }

      // Parse the JSON data into the correct type
      const parsedData: RampingExpectation[] = data.map(item => ({
        id: item.id,
        metric: item.metric,
        month_1: item.month_1 as MonthValue,
        month_2: item.month_2 as MonthValue,
        month_3: item.month_3 as MonthValue,
        month_4: item.month_4 as MonthValue,
        month_5: item.month_5 as MonthValue,
        month_6: item.month_6 as MonthValue,
      }));

      console.log("Parsed data:", parsedData);
      return parsedData;
    },
  });

  if (isLoading) {
    return <div>Loading expectations...</div>;
  }

  if (!expectations || expectations.length === 0) {
    return <div>No expectations data available.</div>;
  }

  const metricLabels: Record<string, string> = {
    dm: "DMs",
    nbm: "NBMs",
    scope_plus: "Scope+",
    new_logo: "NL",
  };

  return (
    <div className="w-full mt-6 mb-12">
      <div className="text-2xl font-semibold text-center mb-6">Ramping Expectations</div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] bg-primary text-primary-foreground">
              Metric
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
          {expectations.map((row: RampingExpectation) => (
            <TableRow key={row.metric}>
              <TableCell className="font-medium bg-primary text-primary-foreground">
                {metricLabels[row.metric]}
              </TableCell>
              {[row.month_1, row.month_2, row.month_3, row.month_4, row.month_5, row.month_6].map((month, index) => (
                <TableCell key={index} className="text-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="inline-flex items-center">
                        {month.value}
                        {month.note && (
                          <InfoIcon className="ml-1 h-4 w-4 text-gray-400" />
                        )}
                      </TooltipTrigger>
                      {month.note && (
                        <TooltipContent>
                          <p>{month.note}</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}