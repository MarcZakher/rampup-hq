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

export function RampingExpectationsTable() {
  const { data: expectations, isLoading } = useQuery({
    queryKey: ["ramping-expectations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ramping_expectations")
        .select("*")
        .order("metric");
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading expectations...</div>;
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
          {expectations?.map((row) => (
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