import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AssessmentMetric {
  name: string;
  completionRate: number;
  successRate: number;
  averageScore: number;
}

interface Props {
  data: AssessmentMetric[];
  title: string;
}

export const AssessmentMetrics = ({ data, title }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              {title === "Assessment Completion Rates" ? (
                <Bar dataKey="completionRate" name="Completion Rate %" fill="#8884d8" />
              ) : (
                <>
                  <Bar dataKey="successRate" name="Success Rate %" fill="#8884d8" />
                  <Bar dataKey="averageScore" name="Average Score" fill="#82ca9d" />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};