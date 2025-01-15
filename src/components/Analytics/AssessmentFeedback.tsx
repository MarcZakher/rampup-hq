import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface AssessmentFeedback {
  id: string;
  assessment: {
    title: string;
  };
  feedback: string | null;
  observed_strengths: string | null;
  areas_for_improvement: string | null;
  recommended_actions: string | null;
  created_at: string;
}

export const AssessmentFeedback = () => {
  const { data: feedbacks, isLoading } = useQuery({
    queryKey: ["assessment-feedbacks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assessment_submissions")
        .select(`
          id,
          feedback,
          observed_strengths,
          areas_for_improvement,
          recommended_actions,
          created_at,
          assessment:assessments (
            title
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching feedback:", error);
        throw error;
      }

      return data as AssessmentFeedback[];
    },
  });

  if (isLoading) {
    return <div>Loading feedback...</div>;
  }

  if (!feedbacks?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Assessment Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No feedback available yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Assessment Feedback
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {feedbacks.map((feedback) => (
          <div key={feedback.id} className="space-y-4 border-b pb-4 last:border-b-0">
            <div>
              <h3 className="font-semibold text-lg">{feedback.assessment.title}</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(feedback.created_at).toLocaleDateString()}
              </p>
            </div>
            
            {feedback.feedback && (
              <div>
                <h4 className="font-medium mb-1">General Feedback</h4>
                <p className="text-sm">{feedback.feedback}</p>
              </div>
            )}
            
            {feedback.observed_strengths && (
              <div>
                <h4 className="font-medium mb-1">Observed Strengths</h4>
                <p className="text-sm">{feedback.observed_strengths}</p>
              </div>
            )}
            
            {feedback.areas_for_improvement && (
              <div>
                <h4 className="font-medium mb-1">Areas for Improvement</h4>
                <p className="text-sm">{feedback.areas_for_improvement}</p>
              </div>
            )}
            
            {feedback.recommended_actions && (
              <div>
                <h4 className="font-medium mb-1">Recommended Actions</h4>
                <p className="text-sm">{feedback.recommended_actions}</p>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};