import { useQuery } from "@tanstack/react-query";
import { TrendingUp } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { RampingExpectation, metricLabels } from "@/types/ramping";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function RampingExpectationsTable() {
  const { data: expectations, isLoading } = useQuery({
    queryKey: ["ramping-expectations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ramping_expectations")
        .select("*")
        .order("metric");

      if (error) {
        console.error("Error fetching ramping expectations:", error);
        throw error;
      }

      return data as RampingExpectation[];
    },
  });

  if (isLoading) {
    return (
      <Card className="w-full mt-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            Loading expectations...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!expectations || expectations.length === 0) {
    return (
      <Card className="w-full mt-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            No expectations data available.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full mt-6">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <CardTitle>Ramping Expectations</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] bg-primary text-primary-foreground">
                Metric
              </TableHead>
              {[1, 2, 3, 4, 5, 6].map((month) => (
                <TableHead
                  key={month}
                  className="text-center bg-muted/50"
                >
                  Month {month}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {expectations.map((row) => (
              <TableRow key={row.metric}>
                <TableCell className="font-medium bg-primary text-primary-foreground">
                  {metricLabels[row.metric]}
                </TableCell>
                {[
                  row.month_1,
                  row.month_2,
                  row.month_3,
                  row.month_4,
                  row.month_5,
                  row.month_6,
                ].map((month, index) => (
                  <TableCell key={index} className="text-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="cursor-default">
                          {month.value}
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
      </CardContent>
    </Card>
  );
}