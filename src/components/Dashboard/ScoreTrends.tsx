import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { calculateAverage } from "@/lib/utils";

interface ScoreTrendsProps {
  salesReps: any[];
}

export function ScoreTrends({ salesReps }: ScoreTrendsProps) {
  const monthlyAverages = [1, 2, 3].map(month => {
    const scores = salesReps.map(rep => {
      const monthScores = rep[`month${month}`];
      return calculateAverage(monthScores);
    });
    return {
      month: `Month ${month}`,
      average: Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2))
    };
  });

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Overall Score Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyAverages}>
              <XAxis dataKey="month" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="average"
                stroke="#2563eb"
                fill="#3b82f6"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}