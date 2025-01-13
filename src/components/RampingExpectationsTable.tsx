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
  const { data: expectations, isLoading, error } = useQuery({
    queryKey: ["ramping-expectations"],
    queryFn: async () => {
      console.log("Starting to fetch ramping expectations...");
      
      try {
        const { data, error } = await supabase
          .from("ramping_expectations")
          .select("*")
          .order("metric");
        
        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }

        console.log("Raw data from Supabase:", data);
        
        if (!data || data.length === 0) {
          console.log("No data found in ramping_expectations table");
          return [];
        }

        // Parse the JSON data into the correct type with proper type checking
        const parsedData: RampingExpectation[] = data.map(item => {
          console.log("Processing item:", item);
          
          const parseMonthValue = (monthData: any): MonthValue => {
            try {
              if (typeof monthData === 'string') {
                return JSON.parse(monthData);
              }
              if (typeof monthData === 'object' && monthData !== null) {
                return {
                  value: String(monthData.value || ''),
                  note: String(monthData.note || '')
                };
              }
              console.error("Invalid month data format:", monthData);
              return { value: '', note: '' };
            } catch (e) {
              console.error("Error parsing month data:", e);
              return { value: '', note: '' };
            }
          };

          return {
            id: item.id,
            metric: item.metric,
            month_1: parseMonthValue(item.month_1),
            month_2: parseMonthValue(item.month_2),
            month_3: parseMonthValue(item.month_3),
            month_4: parseMonthValue(item.month_4),
            month_5: parseMonthValue(item.month_5),
            month_6: parseMonthValue(item.month_6),
          };
        });

        console.log("Final parsed data:", parsedData);
        return parsedData;
      } catch (error) {
        console.error("Error in query function:", error);
        throw error;
      }
    },
  });

  if (isLoading) {
    return <div>Loading expectations...</div>;
  }

  if (error) {
    console.error("Query error:", error);
    return <div>Error loading expectations. Please try again later.</div>;
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