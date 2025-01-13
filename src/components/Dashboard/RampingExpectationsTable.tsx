import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function RampingExpectationsTable() {
  const metrics = [
    { name: "DMs", values: ["5 (booked)", 10, 15, 20, 20, 20] },
    { name: "NBMs", values: [0, 1, 1, 1, 2, 2] },
    { name: "Scope+", values: [0, 0, 1, 1, 1, 1] },
    { name: "NL", values: [0, 0, 0, 0, 0, 1] },
  ];

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
            {metrics.map((metric) => (
              <TableRow key={metric.name}>
                <TableCell className="font-medium bg-gray-800 text-white">
                  {metric.name}
                </TableCell>
                {metric.values.map((value, index) => (
                  <TableCell key={index} className="text-center">
                    {value}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}