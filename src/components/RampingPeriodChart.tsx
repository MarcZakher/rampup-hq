import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const rampingData = [
  {
    metric: "DMs",
    values: [5, 10, 15, 20, 20, 20],
    note: "(booked)",
  },
  {
    metric: "NBMs",
    values: [0, 1, 1, 1, 2, 2],
  },
  {
    metric: "Scope+",
    values: [0, 0, 1, 1, 1, 1],
  },
  {
    metric: "NL",
    values: [0, 0, 0, 0, 0, 1],
  },
];

export function RampingPeriodChart() {
  return (
    <div className="w-full mb-12">
      <div className="text-2xl font-semibold text-center mb-6">Ramping Period</div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] bg-gray-800 text-white">
              &nbsp;
            </TableHead>
            {[1, 2, 3, 4, 5, 6].map((month) => (
              <TableHead
                key={month}
                className={`text-center bg-gradient-to-r from-gray-100 to-gray-300`}
              >
                Month {month}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rampingData.map((row) => (
            <TableRow key={row.metric}>
              <TableCell className="font-medium bg-gray-800 text-white">
                {row.metric}
              </TableCell>
              {row.values.map((value, index) => (
                <TableCell key={index} className="text-center">
                  {value}
                  {index === 0 && row.note && (
                    <span className="text-sm text-gray-500 block">{row.note}</span>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}