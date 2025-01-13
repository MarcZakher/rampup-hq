import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface LowScoreArea {
  assessment: string;
  score: number;
  month: string;
}

interface RepNeedingAttention {
  name: string;
  lowScoreCount: number;
  averageLowScore: number;
  areas: LowScoreArea[];
}

interface Props {
  data: RepNeedingAttention[];
}

export const AreasNeedingAttention = ({ data }: Props) => {
  if (!data?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Areas Needing Attention
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTitle>No areas requiring immediate attention</AlertTitle>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          Areas Needing Attention
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.map((rep, index) => (
          <div key={index} className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold">{rep.name}</h3>
              <p className="text-sm text-muted-foreground">
                {rep.lowScoreCount} low scores (avg: {rep.averageLowScore})
              </p>
            </div>
            <div className="space-y-2">
              {rep.areas.map((area, areaIndex) => (
                <div key={areaIndex} className="flex justify-between items-center text-sm">
                  <span className="text-red-500">{area.assessment}</span>
                  <span>{area.month} - Score: {area.score}</span>
                </div>
              ))}
            </div>
            {index < data.length - 1 && <hr className="my-4" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};