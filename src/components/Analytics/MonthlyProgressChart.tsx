import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { MonthlyScore } from '@/lib/types/analytics';

interface MonthlyProgressChartProps {
  data: MonthlyScore[];
}

export const MonthlyProgressChart = ({ data }: MonthlyProgressChartProps) => {
  const chartConfig = {
    improving: {
      theme: {
        light: '#10B981',
        dark: '#059669',
      },
    },
    declining: {
      theme: {
        light: '#EF4444',
        dark: '#DC2626',
      },
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Monthly Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartContainer config={chartConfig}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="improving" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="declining" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip />
              <Area 
                type="monotone" 
                dataKey="improving" 
                stroke="#10B981" 
                fillOpacity={1} 
                fill="url(#improving)" 
              />
              <Area 
                type="monotone" 
                dataKey="declining" 
                stroke="#EF4444" 
                fillOpacity={1} 
                fill="url(#declining)" 
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};