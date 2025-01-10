import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { calculateAverage } from "@/lib/utils";

interface PerformanceDistributionProps {
  salesReps: any[];
}

export function PerformanceDistribution({ salesReps }: PerformanceDistributionProps) {
  const getOverallAverage = (rep: any) => {
    const allScores = [...rep.month1, ...rep.month2, ...rep.month3];
    return calculateAverage(allScores);
  };

  const distribution = salesReps.reduce((acc: any, rep) => {
    const avg = getOverallAverage(rep);
    if (avg >= 4) acc.excellent++;
    else if (avg >= 3) acc.good++;
    else if (avg >= 2) acc.needsImprovement++;
    else acc.critical++;
    return acc;
  }, { excellent: 0, good: 0, needsImprovement: 0, critical: 0 });

  const data = [
    { name: "Excellent (≥4)", value: distribution.excellent, color: "#22c55e" },
    { name: "Good (3-3.99)", value: distribution.good, color: "#3b82f6" },
    { name: "Needs Improvement (2-2.99)", value: distribution.needsImprovement, color: "#eab308" },
    { name: "Critical (<2)", value: distribution.critical, color: "#ef4444" }
  ];

  return (
    <Card className="col-span-6">
      <CardHeader>
        <CardTitle>Performance Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => `${entry.name}: ${entry.value}`}
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}