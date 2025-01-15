import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface AssessmentFeedback {
  id: string;
  assessment: {
    title: string;
  };
  total_score: number;
  feedback: string | null;
  observed_strengths: string | null;
  areas_for_improvement: string | null;
  recommended_actions: string | null;
  created_at: string;
}

export const AssessmentFeedback = () => {
  const [selectedFeedback, setSelectedFeedback] = useState<AssessmentFeedback | null>(null);

  // First, get Amina's profile ID
  const { data: profileId, isLoading: isLoadingProfile, error: profileError } = useQuery({
    queryKey: ["amina-profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .eq('email', 'amina.boualem@example.com')
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }

      if (!data) {
        throw new Error("Profile not found for Amina Boualem");
      }

      return data.id;
    },
  });

  // Then use the profile ID to fetch submissions
  const { data: feedbacks, isLoading: isLoadingFeedbacks } = useQuery({
    queryKey: ["assessment-feedbacks", profileId],
    queryFn: async () => {
      if (!profileId) return [];

      const { data, error } = await supabase
        .from("assessment_submissions")
        .select(`
          id,
          total_score,
          feedback,
          observed_strengths,
          areas_for_improvement,
          recommended_actions,
          created_at,
          assessment:assessments (
            title
          )
        `)
        .eq('sales_rep_id', profileId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching feedback:", error);
        throw error;
      }

      return data as AssessmentFeedback[];
    },
    enabled: !!profileId,
  });

  const getScoreColor = (score: number) => {
    if (score >= 4) return "border-assessment-green bg-assessment-green/10";
    if (score >= 3) return "border-assessment-yellow bg-assessment-yellow/10";
    return "border-assessment-red bg-assessment-red/10";
  };

  if (isLoadingProfile || isLoadingFeedbacks) {
    return <div>Loading feedback...</div>;
  }

  if (profileError) {
    return <div>Error: Profile not found for Amina Boualem</div>;
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
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Assessment Feedback
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {feedbacks.map((feedback) => (
            <Card 
              key={feedback.id}
              className={cn("cursor-pointer transition-colors", getScoreColor(feedback.total_score))}
              onClick={() => setSelectedFeedback(feedback)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{feedback.assessment.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(feedback.created_at), "MMM d, yyyy")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Score: {feedback.total_score.toFixed(1)}</span>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Dialog open={!!selectedFeedback} onOpenChange={() => setSelectedFeedback(null)}>
        {selectedFeedback && (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedFeedback.assessment.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {format(new Date(selectedFeedback.created_at), "MMMM d, yyyy")}
                </span>
                <span className="font-medium">
                  Score: {selectedFeedback.total_score.toFixed(1)}
                </span>
              </div>
              
              {selectedFeedback.feedback && (
                <div>
                  <h4 className="font-medium mb-1">General Feedback</h4>
                  <p className="text-sm text-muted-foreground">{selectedFeedback.feedback}</p>
                </div>
              )}
              
              {selectedFeedback.observed_strengths && (
                <div>
                  <h4 className="font-medium mb-1">Observed Strengths</h4>
                  <p className="text-sm text-muted-foreground">{selectedFeedback.observed_strengths}</p>
                </div>
              )}
              
              {selectedFeedback.areas_for_improvement && (
                <div>
                  <h4 className="font-medium mb-1">Areas for Improvement</h4>
                  <p className="text-sm text-muted-foreground">{selectedFeedback.areas_for_improvement}</p>
                </div>
              )}
              
              {selectedFeedback.recommended_actions && (
                <div>
                  <h4 className="font-medium mb-1">Recommended Actions</h4>
                  <p className="text-sm text-muted-foreground">{selectedFeedback.recommended_actions}</p>
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};