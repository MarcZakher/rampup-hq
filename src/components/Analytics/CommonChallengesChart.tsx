import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { AlertTriangle } from 'lucide-react';
import { AreaOfFocus } from '@/lib/types/analytics';

interface CommonChallengesChartProps {
  data: AreaOfFocus;
}

export const CommonChallengesChart = ({ data }: CommonChallengesChartProps) => {
  const chartConfig = {
    warning: {
      theme: {
        light: '#fbbf24',
        dark: '#d97706',
      },
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <AlertTriangle className="h-6 w-6 text-yellow-500" />
          Common Challenges
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartContainer config={chartConfig}>
            <BarChart 
              data={data.commonChallenges} 
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="assessment" type="category" width={150} />
              <ChartTooltip />
              <Bar dataKey="count" fill="#fbbf24" />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};