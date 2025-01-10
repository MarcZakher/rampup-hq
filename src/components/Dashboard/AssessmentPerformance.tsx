import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { calculateAverage } from "@/lib/utils";

interface AssessmentPerformanceProps {
  salesReps: any[];
  assessments: {
    month1: { name: string; shortName: string }[];
    month2: { name: string; shortName: string }[];
    month3: { name: string; shortName: string }[];
  };
}

export function AssessmentPerformance({ salesReps, assessments }: AssessmentPerformanceProps) {
  const getAssessmentAverages = (month: 'month1' | 'month2' | 'month3', index: number) => {
    return salesReps.reduce((sum, rep) => sum + (rep[month][index] || 0), 0) / salesReps.length;
  };

  const assessmentData = [
    ...assessments.month1.map((assessment, index) => ({
      name: assessment.shortName,
      fullName: assessment.name,
      average: Number(getAssessmentAverages('month1', index).toFixed(2)),
      month: 1
    })),
    ...assessments.month2.map((assessment, index) => ({
      name: assessment.shortName,
      fullName: assessment.name,
      average: Number(getAssessmentAverages('month2', index).toFixed(2)),
      month: 2
    })),
    ...assessments.month3.map((assessment, index) => ({
      name: assessment.shortName,
      fullName: assessment.name,
      average: Number(getAssessmentAverages('month3', index).toFixed(2)),
      month: 3
    }))
  ].sort((a, b) => a.average - b.average);

  return (
    <Card className="col-span-6">
      <CardHeader>
        <CardTitle>Assessment Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={assessmentData}>
              <XAxis 
                dataKey="name" 
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <YAxis domain={[0, 5]} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-2 border rounded shadow">
                        <p className="font-semibold">{data.fullName}</p>
                        <p>Month: {data.month}</p>
                        <p>Average: {data.average.toFixed(2)}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="average" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}