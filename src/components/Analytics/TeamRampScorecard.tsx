import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface TeamRampScorecardProps {
  metrics: {
    label: string;
    value: number;
  }[];
}

export function TeamRampScorecard({ metrics }: TeamRampScorecardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Ramp Scorecard</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{metric.label}</span>
              <span className="font-medium">{metric.value}%</span>
            </div>
            <Progress value={metric.value} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}