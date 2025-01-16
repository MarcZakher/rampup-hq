import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface FeedbackSubmission {
  id: string;
  assessment: {
    title: string;
  };
  sales_rep: {
    full_name: string | null;
  };
  total_score: number;
  created_at: string;
  feedback: string;
  observed_strengths: string;
  areas_for_improvement: string;
  recommended_actions: string;
}

export function FeedbackList({ onEdit }: { onEdit: (id: string) => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: submissions, isLoading } = useQuery({
    queryKey: ["feedback-submissions"],
    queryFn: async () => {
      console.log("Fetching feedback submissions");
      const { data, error } = await supabase
        .from("assessment_submissions")
        .select(`
          id,
          total_score,
          created_at,
          feedback,
          observed_strengths,
          areas_for_improvement,
          recommended_actions,
          assessment:assessments(title),
          sales_rep:profiles!assessment_submissions_sales_rep_id_fkey(full_name)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching submissions:", error);
        throw error;
      }
      console.log("Fetched submissions:", data);
      return data as FeedbackSubmission[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // First delete related criteria scores
      const { error: scoresError } = await supabase
        .from("assessment_criteria_scores")
        .delete()
        .eq("submission_id", id);
      
      if (scoresError) throw scoresError;

      // Then delete the submission
      const { error } = await supabase
        .from("assessment_submissions")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedback-submissions"] });
      toast({
        title: "Success",
        description: "Feedback deleted successfully",
      });
    },
    onError: (error) => {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: "Failed to delete feedback",
        variant: "destructive",
      });
    },
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getScoreColor = (score: number) => {
    if (score >= 4) return "border-assessment-green bg-assessment-green/10";
    if (score >= 3) return "border-assessment-yellow bg-assessment-yellow/10";
    return "border-assessment-red bg-assessment-red/10";
  };

  if (isLoading) {
    return <div>Loading submissions...</div>;
  }

  return (
    <div className="space-y-4">
      {submissions?.map((submission) => (
        <Card 
          key={submission.id}
          className={cn("transition-colors", getScoreColor(submission.total_score))}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">
                  {submission.assessment.title}
                </CardTitle>
                <CardDescription>
                  Sales Rep: {submission.sales_rep.full_name}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(submission.id)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this feedback?")) {
                      deleteMutation.mutate(submission.id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => toggleExpand(submission.id)}
                >
                  {expandedId === submission.id ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-sm mb-2">
              <span>Score: {submission.total_score.toFixed(1)}</span>
              <span>
                {format(new Date(submission.created_at), "MMM d, yyyy")}
              </span>
            </div>
            {expandedId === submission.id && (
              <div className="space-y-4 mt-4 text-sm">
                {submission.observed_strengths && (
                  <div>
                    <h4 className="font-semibold">Observed Strengths:</h4>
                    <p className="text-gray-600">{submission.observed_strengths}</p>
                  </div>
                )}
                {submission.areas_for_improvement && (
                  <div>
                    <h4 className="font-semibold">Areas for Improvement:</h4>
                    <p className="text-gray-600">{submission.areas_for_improvement}</p>
                  </div>
                )}
                {submission.recommended_actions && (
                  <div>
                    <h4 className="font-semibold">Recommended Actions:</h4>
                    <p className="text-gray-600">{submission.recommended_actions}</p>
                  </div>
                )}
                {submission.feedback && (
                  <div>
                    <h4 className="font-semibold">Additional Feedback:</h4>
                    <p className="text-gray-600">{submission.feedback}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}