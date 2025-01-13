import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const staticData = [
  {
    metric: "DMs",
    months: [
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
    months: [
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
    months: [
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
    months: [
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
          {staticData.map((row, index) => (
            <TableRow key={index} className="hover:bg-gray-50">
              <TableCell className="font-medium bg-gray-700 text-white">
                {row.metric}
              </TableCell>
              {row.months.map((month, monthIndex) => (
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