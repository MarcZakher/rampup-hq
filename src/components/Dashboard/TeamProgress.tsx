import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { calculateAverage } from "@/lib/utils";

interface TeamProgressProps {
  salesReps: any[];
}

export function TeamProgress({ salesReps }: TeamProgressProps) {
  const meetingTarget = salesReps.filter(rep => {
    const allScores = [...rep.month1, ...rep.month2, ...rep.month3];
    const avg = calculateAverage(allScores);
    return avg >= 3;
  }).length;

  const percentageMeetingTarget = (meetingTarget / salesReps.length) * 100;

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Team Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Reps Meeting Target Score (≥3)</p>
            <div className="mt-2">
              <Progress value={percentageMeetingTarget} />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {meetingTarget} out of {salesReps.length} reps ({percentageMeetingTarget.toFixed(1)}%)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}