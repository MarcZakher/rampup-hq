import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FeedbackDetails {
  id: string;
  sales_rep_name: string;
  total_score: number;
  feedback: string | null;
  observed_strengths: string | null;
  areas_for_improvement: string | null;
  recommended_actions: string | null;
  created_at: string;
}

interface QueryResponse {
  id: string;
  total_score: number;
  feedback: string | null;
  observed_strengths: string | null;
  areas_for_improvement: string | null;
  recommended_actions: string | null;
  created_at: string;
  sales_rep_id: string;
  profiles: {
    full_name: string | null;
  };
}

export const FeedbackHistory = () => {
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackDetails | null>(null);

  const { data: feedbacks, isLoading } = useQuery({
    queryKey: ['managerFeedbacks'],
    queryFn: async () => {
      const { data: submissions, error } = await supabase
        .from('assessment_submissions')
        .select(`
          id,
          total_score,
          feedback,
          observed_strengths,
          areas_for_improvement,
          recommended_actions,
          created_at,
          sales_rep_id,
          profiles (
            full_name
          )
        `)
        .eq('manager_id', (await supabase.auth.getUser()).data.user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return submissions.map((submission: QueryResponse) => ({
        id: submission.id,
        sales_rep_name: submission.profiles?.full_name || 'Unknown',
        total_score: submission.total_score,
        feedback: submission.feedback,
        observed_strengths: submission.observed_strengths,
        areas_for_improvement: submission.areas_for_improvement,
        recommended_actions: submission.recommended_actions,
        created_at: new Date(submission.created_at).toLocaleDateString(),
      }));
    },
  });

  if (isLoading) {
    return <div>Loading feedback history...</div>;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Recent Feedback History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {feedbacks?.map((feedback) => (
              <Card key={feedback.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{feedback.sales_rep_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Submitted on {feedback.created_at} - Score: {feedback.total_score}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedFeedback(feedback)}
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>

      <Dialog open={!!selectedFeedback} onOpenChange={() => setSelectedFeedback(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Feedback Details for {selectedFeedback?.sales_rep_name}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[600px] pr-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">General Feedback</h4>
                <p className="text-sm">{selectedFeedback?.feedback || 'No feedback provided'}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Observed Strengths</h4>
                <p className="text-sm">{selectedFeedback?.observed_strengths || 'No strengths noted'}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Areas for Improvement</h4>
                <p className="text-sm">{selectedFeedback?.areas_for_improvement || 'No areas noted'}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Recommended Actions</h4>
                <p className="text-sm">{selectedFeedback?.recommended_actions || 'No actions recommended'}</p>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </Card>
  );
};