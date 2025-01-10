import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PerformanceDistributionProps {
  salesReps: {
    id: number;
    name: string;
    month1: number[];
    month2: number[];
    month3: number[];
  }[];
}

export function PerformanceDistribution({ salesReps }: PerformanceDistributionProps) {
  const calculateDistribution = () => {
    const distributions = salesReps.map(rep => {
      const allScores = [...rep.month1, ...rep.month2, ...rep.month3].filter(score => score > 0);
      if (allScores.length === 0) return null;
      const average = allScores.reduce((a, b) => a + b, 0) / allScores.length;
      return average;
    }).filter((score): score is number => score !== null);

    const ranges = [
      { name: 'Below Average (< 3)', range: [0, 3], color: '#EF4444' },
      { name: 'Meeting Expectations (3-4)', range: [3, 4], color: '#FBBF24' },
      { name: 'Exceeding Expectations (> 4)', range: [4, 5], color: '#22C55E' }
    ];

    return ranges.map(({ name, range, color }) => ({
      name,
      value: distributions.filter(score => score >= range[0] && score < range[1]).length,
      color
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={calculateDistribution()}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={(entry) => `${entry.name}: ${entry.value}`}
              >
                {calculateDistribution().map((entry, index) => (
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