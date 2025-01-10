import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const initialProgressData = [
  {
    metric: "DMs",
    values: Array(6).fill(""),
  },
  {
    metric: "NBMs",
    values: Array(6).fill(""),
  },
  {
    metric: "Scope+",
    values: Array(6).fill(""),
  },
  {
    metric: "NL",
    values: Array(6).fill(""),
  },
];

export function ProgressTrackingTable() {
  const [progressData, setProgressData] = useState(initialProgressData);

  const handleInputChange = (metricIndex: number, monthIndex: number, value: string) => {
    const newData = [...progressData];
    newData[metricIndex] = {
      ...newData[metricIndex],
      values: newData[metricIndex].values.map((v, i) => (i === monthIndex ? value : v)),
    };
    setProgressData(newData);
  };

  return (
    <div className="w-full mt-12">
      <div className="text-2xl font-semibold text-center mb-6">Track Your Progress</div>
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
          {progressData.map((row, rowIndex) => (
            <TableRow key={row.metric}>
              <TableCell className="font-medium bg-primary text-primary-foreground">
                {row.metric}
              </TableCell>
              {row.values.map((value, columnIndex) => (
                <TableCell key={columnIndex} className="p-2">
                  <Input
                    type="number"
                    value={value}
                    onChange={(e) => handleInputChange(rowIndex, columnIndex, e.target.value)}
                    className="text-center h-8"
                    min="0"
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}