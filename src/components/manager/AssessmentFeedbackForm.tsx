import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';

interface SalesRep {
  id: string;
  full_name: string;
}

interface Assessment {
  id: string;
  title: string;
}

interface Criteria {
  id: string;
  title: string;
}

interface FeedbackFormData {
  salesRepId: string;
  assessmentId: string;
  criteriaScores: { [key: string]: number };
  observedStrengths: string;
  areasForImprovement: string;
  recommendedActions: string;
  feedback: string;
}

export function AssessmentFeedbackForm() {
  const [selectedAssessment, setSelectedAssessment] = useState<string>('');
  const { toast } = useToast();
  const form = useForm<FeedbackFormData>();

  // Fetch sales reps
  const { data: salesReps } = useQuery({
    queryKey: ['salesReps'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .order('full_name');
      
      if (error) throw error;
      return data as SalesRep[];
    },
  });

  // Fetch assessments
  const { data: assessments } = useQuery({
    queryKey: ['assessments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assessments')
        .select('id, title')
        .order('created_at');
      
      if (error) throw error;
      return data as Assessment[];
    },
  });

  // Fetch criteria for selected assessment
  const { data: criteria } = useQuery({
    queryKey: ['criteria', selectedAssessment],
    queryFn: async () => {
      if (!selectedAssessment) return [];
      const { data, error } = await supabase
        .from('assessment_criteria')
        .select('id, title')
        .eq('assessment_id', selectedAssessment)
        .order('created_at');
      
      if (error) throw error;
      return data as Criteria[];
    },
    enabled: !!selectedAssessment,
  });

  // Submit feedback
  const submitMutation = useMutation({
    mutationFn: async (data: FeedbackFormData) => {
      // Calculate total score (average of all criteria scores)
      const scores = Object.values(data.criteriaScores);
      const totalScore = scores.reduce((a, b) => a + b, 0) / scores.length;

      // Create assessment submission
      const { data: submission, error: submissionError } = await supabase
        .from('assessment_submissions')
        .insert({
          assessment_id: data.assessmentId,
          sales_rep_id: data.salesRepId,
          manager_id: (await supabase.auth.getUser()).data.user?.id,
          total_score: totalScore,
          feedback: data.feedback,
          observed_strengths: data.observedStrengths,
          areas_for_improvement: data.areasForImprovement,
          recommended_actions: data.recommendedActions,
        })
        .select()
        .single();

      if (submissionError) throw submissionError;

      // Create criteria scores
      const criteriaScores = Object.entries(data.criteriaScores).map(([criteriaId, score]) => ({
        submission_id: submission.id,
        criteria_id: criteriaId,
        score,
      }));

      const { error: scoresError } = await supabase
        .from('assessment_criteria_scores')
        .insert(criteriaScores);

      if (scoresError) throw scoresError;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Assessment feedback submitted successfully",
      });
      form.reset();
      setSelectedAssessment('');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit assessment feedback",
        variant: "destructive",
      });
      console.error('Submission error:', error);
    },
  });

  const onSubmit = (data: FeedbackFormData) => {
    submitMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="salesRepId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sales Representative</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a sales rep" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {salesReps?.map((rep) => (
                    <SelectItem key={rep.id} value={rep.id}>
                      {rep.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="assessmentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assessment</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedAssessment(value);
                }} 
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an assessment" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {assessments?.map((assessment) => (
                    <SelectItem key={assessment.id} value={assessment.id}>
                      {assessment.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        {criteria?.map((criterion) => (
          <FormField
            key={criterion.id}
            control={form.control}
            name={`criteriaScores.${criterion.id}`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{criterion.title}</FormLabel>
                <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a score (1-5)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((score) => (
                      <SelectItem key={score} value={score.toString()}>
                        {score}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        ))}

        <FormField
          control={form.control}
          name="observedStrengths"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observed Strengths</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter observed strengths" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="areasForImprovement"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Areas for Improvement</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter areas for improvement" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="recommendedActions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recommended Actions</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter recommended actions" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="feedback"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Feedback</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter additional feedback" />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Submit Feedback
        </Button>
      </form>
    </Form>
  );
}