import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { AreaOfFocus } from '@/lib/types/analytics';

interface AreasNeedingAttentionProps {
  data: AreaOfFocus;
}

export const AreasNeedingAttention = ({ data }: AreasNeedingAttentionProps) => {
  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <AlertTriangle className="h-6 w-6 text-yellow-500" />
          Areas Needing Attention
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 max-h-[300px] overflow-y-auto">
          {data.repsNeedingAttention.map((rep, index) => (
            <div key={index} className="p-4 bg-yellow-50 rounded-lg space-y-2">
              <h3 className="text-lg font-semibold">{rep.name}</h3>
              <p className="text-sm text-muted-foreground">
                {rep.lowScoreCount} low scores (avg: {rep.averageLowScore})
              </p>
              <div className="space-y-2">
                {rep.areas.map((area, areaIndex) => (
                  <div key={areaIndex} className="flex justify-between text-sm">
                    <span className="text-red-500 font-medium">{area.assessment}</span>
                    <span>{area.month} - Score: {area.score}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};