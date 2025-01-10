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
    values: [
      { value: "5", note: "(booked)" },
      { value: "10", note: "" },
      { value: "15", note: "" },
      { value: "20", note: "" },
      { value: "20", note: "" },
      { value: "20", note: "" },
    ],
  },
  {
    metric: "NBMs",
    values: [
      { value: "0", note: "" },
      { value: "1", note: "" },
      { value: "1", note: "" },
      { value: "1", note: "" },
      { value: "2", note: "" },
      { value: "2", note: "" },
    ],
  },
  {
    metric: "Scope+",
    values: [
      { value: "0", note: "" },
      { value: "0", note: "" },
      { value: "1", note: "" },
      { value: "1", note: "" },
      { value: "1", note: "" },
      { value: "1", note: "" },
    ],
  },
  {
    metric: "NL",
    values: [
      { value: "0", note: "" },
      { value: "0", note: "" },
      { value: "0", note: "" },
      { value: "0", note: "" },
      { value: "0", note: "" },
      { value: "1", note: "" },
    ],
  },
];

export function RampingPeriodTable() {
  return (
    <div className="w-full">
      <div className="text-2xl font-semibold text-center mb-6">Expectations during the Ramping Period</div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] bg-gray-700 text-white">
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
              <TableCell className="font-medium bg-gray-700 text-white">
                {row.metric}
              </TableCell>
              {row.values.map((cell, index) => (
                <TableCell key={index} className="text-center">
                  {cell.value}
                  {cell.note && (
                    <span className="text-sm text-gray-500">{cell.note}</span>
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