import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { assessments } from '@/pages/director/Dashboard';

interface AssessmentPerformanceProps {
  salesReps: {
    id: number;
    name: string;
    month1: number[];
    month2: number[];
    month3: number[];
  }[];
}

export function AssessmentPerformance({ salesReps }: AssessmentPerformanceProps) {
  const calculateAssessmentAverages = () => {
    const allAssessments = [
      ...assessments.month1.map((a, i) => ({ ...a, month: 1, index: i })),
      ...assessments.month2.map((a, i) => ({ ...a, month: 2, index: i })),
      ...assessments.month3.map((a, i) => ({ ...a, month: 3, index: i }))
    ];

    return allAssessments.map(assessment => {
      const scores = salesReps.map(rep => {
        const monthScores = assessment.month === 1 ? rep.month1 : 
                          assessment.month === 2 ? rep.month2 : rep.month3;
        return monthScores[assessment.index];
      }).filter(score => score > 0);

      const average = scores.length > 0
        ? Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1))
        : 0;

      return {
        name: assessment.shortName,
        average,
        fullName: assessment.name
      };
    });
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Assessment Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={calculateAssessmentAverages()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 5]} />
              <Tooltip 
                formatter={(value: number) => [value.toFixed(1), 'Average Score']}
                labelFormatter={(label: string) => {
                  const assessment = calculateAssessmentAverages().find(a => a.name === label);
                  return assessment?.fullName || label;
                }}
              />
              <Bar dataKey="average" fill="#60A5FA" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}