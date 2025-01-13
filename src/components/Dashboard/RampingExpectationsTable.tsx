import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function RampingExpectationsTable() {
  const { data: rampingData, isLoading } = useQuery({
    queryKey: ['ramping-expectations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ramping_expectations')
        .select('*')
        .order('metric');

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div className="text-center py-4">Loading ramping expectations...</div>;
  }

  if (!rampingData || rampingData.length === 0) {
    return <div className="text-center py-4">No ramping expectations available</div>;
  }

  const parseMonthValue = (value: any) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (e) {
        return { value: '', note: '' };
      }
    }
    return value || { value: '', note: '' };
  };

  return (
    <div className="space-y-4 mb-8">
      <h2 className="text-2xl font-bold">Ramping Expectations</h2>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="bg-gray-100 w-32">Metrics</TableHead>
              {[1, 2, 3, 4, 5, 6].map((month) => (
                <TableHead key={month} className="bg-gray-100 text-center">
                  Month {month}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rampingData.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium bg-gray-800 text-white">
                  {row.metric}
                </TableCell>
                {[1, 2, 3, 4, 5, 6].map((month) => {
                  const monthKey = `month_${month}`;
                  const monthData = parseMonthValue(row[monthKey as keyof typeof row]);
                  return (
                    <TableCell key={month} className="text-center">
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
    </div>
  );
}