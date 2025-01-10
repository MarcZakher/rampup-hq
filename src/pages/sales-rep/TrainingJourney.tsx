import { CustomAppLayout } from "@/components/Layout/CustomAppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PlayCircle, CheckCircle2, BookOpen } from "lucide-react";

const trainingModules = [
  {
    id: 1,
    title: "Discovery Meeting Fundamentals",
    description: "Learn the key components of successful discovery meetings",
    progress: 100,
    status: "completed",
    duration: "2 hours"
  },
  {
    id: 2,
    title: "Solution Architecture Program",
    description: "Understanding technical architecture and solution design",
    progress: 60,
    status: "in-progress",
    duration: "4 hours"
  },
  {
    id: 3,
    title: "New Business Meeting Excellence",
    description: "Master the art of conducting effective new business meetings",
    progress: 0,
    status: "not-started",
    duration: "3 hours"
  },
  {
    id: 4,
    title: "Competitive Analysis",
    description: "Learn about competitor products and positioning strategies",
    progress: 0,
    status: "not-started",
    duration: "2.5 hours"
  }
];

export default function TrainingJourney() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-6 w-6 text-green-500" />;
      case "in-progress":
        return <PlayCircle className="h-6 w-6 text-blue-500" />;
      default:
        return <BookOpen className="h-6 w-6 text-gray-400" />;
    }
  };

  return (
    <CustomAppLayout>
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Training Journey</h1>
          <p className="text-gray-600">Track your progress through the sales training program</p>
        </div>

        <div className="grid gap-6">
          {trainingModules.map((module) => (
            <Card key={module.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-semibold">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(module.status)}
                    {module.title}
                  </div>
                </CardTitle>
                <span className="text-sm text-gray-500">{module.duration}</span>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{module.description}</p>
                <div className="space-y-4">
                  <Progress value={module.progress} className="h-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {module.progress}% Complete
                    </span>
                    <Button
                      variant={module.status === "completed" ? "secondary" : "default"}
                      disabled={module.status === "completed"}
                    >
                      {module.status === "completed" ? "Completed" : "Start Module"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </CustomAppLayout>
  );
}