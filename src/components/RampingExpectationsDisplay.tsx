import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function RampingExpectationsDisplay() {
  const { data: expectations } = useQuery({
    queryKey: ['ramping-expectations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ramping_expectations')
        .select('*');
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="w-full mb-8">
      <div className="text-2xl font-semibold text-center mb-6">Ramping Period</div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] bg-gray-800 text-white">&nbsp;</TableHead>
            {[1, 2, 3, 4, 5, 6].map((month) => (
              <TableHead
                key={month}
                className={`text-center bg-gradient-to-b from-gray-100 to-gray-300 font-medium`}
              >
                Month {month}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            { metric: 'DMs', values: [5, 10, 15, 20, 20, 20] },
            { metric: 'NBMs', values: [0, 1, 1, 1, 2, 2] },
            { metric: 'Scope+', values: [0, 0, 1, 1, 1, 1] },
            { metric: 'NL', values: [0, 0, 0, 0, 0, 1] },
          ].map((row) => (
            <TableRow key={row.metric}>
              <TableCell className="font-medium bg-gray-800 text-white">
                {row.metric}
              </TableCell>
              {row.values.map((value, index) => (
                <TableCell key={index} className="text-center">
                  {value}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}