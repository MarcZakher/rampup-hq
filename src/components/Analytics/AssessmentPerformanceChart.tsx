import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { AssessmentStats } from '@/lib/types/analytics';

interface AssessmentPerformanceChartProps {
  data: AssessmentStats[];
}

export const AssessmentPerformanceChart = ({ data }: AssessmentPerformanceChartProps) => {
  const chartConfig = {
    primary: {
      theme: {
        light: '#8884d8',
        dark: '#6366f1',
      },
    },
    secondary: {
      theme: {
        light: '#82ca9d',
        dark: '#10b981',
      },
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Assessment Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartContainer config={chartConfig}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip />
              <Bar dataKey="successRate" fill="#8884d8" name="Success Rate %" />
              <Bar dataKey="avgScore" fill="#82ca9d" name="Average Score" />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};