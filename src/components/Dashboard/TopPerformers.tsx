import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { calculateAverage } from "@/lib/utils";

interface TopPerformersProps {
  salesReps: any[];
}

export function TopPerformers({ salesReps }: TopPerformersProps) {
  const repsWithScores = salesReps.map(rep => {
    const month1Avg = calculateAverage(rep.month1);
    const month2Avg = calculateAverage(rep.month2);
    const month3Avg = calculateAverage(rep.month3);
    const overallAvg = calculateAverage([...rep.month1, ...rep.month2, ...rep.month3]);
    const improvement = month3Avg - month1Avg;

    return {
      name: rep.name,
      overallAvg,
      improvement,
      consistency: Math.abs(month2Avg - month1Avg) + Math.abs(month3Avg - month2Avg)
    };
  });

  const topPerformers = [...repsWithScores]
    .sort((a, b) => b.overallAvg - a.overallAvg)
    .slice(0, 5);

  const mostImproved = [...repsWithScores]
    .sort((a, b) => b.improvement - a.improvement)
    .slice(0, 5);

  return (
    <Card className="col-span-8">
      <CardHeader>
        <CardTitle>Top Performers & Most Improved</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Top Overall Performers</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Average Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topPerformers.map((rep, index) => (
                  <TableRow key={index}>
                    <TableCell>{rep.name}</TableCell>
                    <TableCell>{rep.overallAvg.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Most Improved</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Improvement</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mostImproved.map((rep, index) => (
                  <TableRow key={index}>
                    <TableCell>{rep.name}</TableCell>
                    <TableCell>{rep.improvement > 0 ? "+" : ""}{rep.improvement.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}