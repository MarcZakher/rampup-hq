import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PlayCircle, CheckCircle2, BookOpen, ExternalLink } from "lucide-react";
import { TrainingModule } from "@/types/training";

interface TrainingModuleCardProps {
  module: TrainingModule;
  onStartModule: (moduleId: number) => void;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-6 w-6 text-assessment-green" />;
    case "in-progress":
      return <PlayCircle className="h-6 w-6 text-blue-500" />;
    default:
      return <BookOpen className="h-6 w-6 text-gray-400" />;
  }
};

export function TrainingModuleCard({ module, onStartModule }: TrainingModuleCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">
          <div className="flex items-center gap-3">
            {getStatusIcon(module.status)}
            {module.title}
          </div>
        </CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{module.duration}</span>
          {module.platform && (
            <Button variant="outline" size="sm" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              {module.platform}
            </Button>
          )}
        </div>
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
              onClick={() => onStartModule(module.id)}
            >
              {module.status === "completed" ? "Completed" : "Start Module"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}