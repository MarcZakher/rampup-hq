import { CustomAppLayout } from "@/components/Layout/CustomAppLayout";
import { TrainingProgress } from "@/components/Dashboard/TrainingProgress";
import { getSalesReps } from "@/lib/utils/analytics";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ASSESSMENTS } from "@/lib/constants/assessments";
import { useAuth } from "@/lib/context/auth-context";

interface MonthProgress {
  month: string;
  completion: number;
}

interface AssessmentScore {
  name: string;
  score: number;
  month: number;
}

export default function SalesRepAnalytics() {
  const [monthlyProgress, setMonthlyProgress] = useState<MonthProgress[]>([]);
  const [assessmentScores, setAssessmentScores] = useState<AssessmentScore[]>([]);
  const [assessmentsToRetake, setAssessmentsToRetake] = useState<AssessmentScore[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) return;
      
      // Get the logged-in sales rep's data
      const salesReps = await getSalesReps(user.id);
      const currentRep = salesReps.find(rep => rep.id.toString() === user.id);

      if (currentRep) {
        // Calculate completion percentages based on non-zero scores
        const month1Completion = (currentRep.month1.filter(score => score > 0).length / currentRep.month1.length) * 100;
        const month2Completion = (currentRep.month2.filter(score => score > 0).length / currentRep.month2.length) * 100;
        const month3Completion = (currentRep.month3.filter(score => score > 0).length / currentRep.month3.length) * 100;

        setMonthlyProgress([
          { month: "Month 1", completion: Math.round(month1Completion) },
          { month: "Month 2", completion: Math.round(month2Completion) },
          { month: "Month 3", completion: Math.round(month3Completion) },
          { month: "Month 4", completion: 0 }
        ]);

        // Prepare assessment scores
        const scores: AssessmentScore[] = [
          ...currentRep.month1.map((score, index) => ({
            name: ASSESSMENTS.month1[index],
            score,
            month: 1
          })),
          ...currentRep.month2.map((score, index) => ({
            name: ASSESSMENTS.month2[index],
            score,
            month: 2
          })),
          ...currentRep.month3.map((score, index) => ({
            name: ASSESSMENTS.month3[index],
            score,
            month: 3
          }))
        ].filter(score => score.score > 0); // Only show completed assessments

        setAssessmentScores(scores);

        // Filter assessments that need to be retaken (score < 3)
        const retakeAssessments = scores.filter(score => score.score < 3);
        setAssessmentsToRetake(retakeAssessments);
      }
    };

    loadData();
  }, [user]);

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-green-600';
    if (score >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <CustomAppLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">My Analytics</h1>
        <div className="space-y-8">
          <Card>
            <CardContent className="pt-6">
              <TrainingProgress progress={monthlyProgress} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assessment Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Assessment</TableHead>
                    <TableHead>Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assessmentScores.map((assessment, index) => (
                    <TableRow key={index}>
                      <TableCell>Month {assessment.month}</TableCell>
                      <TableCell>{assessment.name}</TableCell>
                      <TableCell className={getScoreColor(assessment.score)}>
                        {assessment.score.toFixed(1)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {assessmentsToRetake.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Assessments to Retake</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead>Assessment</TableHead>
                      <TableHead>Current Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assessmentsToRetake.map((assessment, index) => (
                      <TableRow key={index}>
                        <TableCell>Month {assessment.month}</TableCell>
                        <TableCell>{assessment.name}</TableCell>
                        <TableCell className="text-red-600">
                          {assessment.score.toFixed(1)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </CustomAppLayout>
  );
}