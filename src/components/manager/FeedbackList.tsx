import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface FeedbackSubmission {
  id: string;
  assessment: {
    title: string;
  };
  sales_rep: {
    full_name: string;
  };
  total_score: number;
  created_at: string;
}

export function FeedbackList({ onEdit }: { onEdit: (id: string) => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: submissions, isLoading } = useQuery({
    queryKey: ["feedback-submissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assessment_submissions")
        .select(`
          id,
          total_score,
          created_at,
          assessment:assessments(title),
          sales_rep:profiles!assessment_submissions_sales_rep_id_fkey(full_name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as FeedbackSubmission[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
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

  if (isLoading) {
    return <div>Loading submissions...</div>;
  }

  return (
    <div className="space-y-4">
      {submissions?.map((submission) => (
        <Card key={submission.id}>
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
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-sm">
              <span>Score: {submission.total_score.toFixed(1)}</span>
              <span>
                {format(new Date(submission.created_at), "MMM d, yyyy")}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}