import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ScoreTrendsProps {
  salesReps: {
    id: number;
    name: string;
    month1: number[];
    month2: number[];
    month3: number[];
  }[];
}

export function ScoreTrends({ salesReps }: ScoreTrendsProps) {
  const calculateMonthlyAverages = () => {
    const monthlyData = [1, 2, 3].map(month => {
      const monthScores = salesReps.map(rep => {
        const scores = month === 1 ? rep.month1 : month === 2 ? rep.month2 : rep.month3;
        return scores.filter(score => score > 0);
      }).flat();
      
      const average = monthScores.length > 0
        ? Number((monthScores.reduce((a, b) => a + b, 0) / monthScores.length).toFixed(1))
        : 0;
        
      return {
        month: `Month ${month}`,
        average
      };
    });
    return monthlyData;
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Score Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={calculateMonthlyAverages()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Line type="monotone" dataKey="average" stroke="#1E40AF" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}