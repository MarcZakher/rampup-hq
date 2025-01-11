import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RampTrajectoryProps {
  data: any[];
  metric: string;
}

export function RampTrajectoryChart({ data, metric }: RampTrajectoryProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{metric} Trajectory</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke="#8884d8" name="Actual" />
              <Line type="monotone" dataKey="target" stroke="#82ca9d" name="Target" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}