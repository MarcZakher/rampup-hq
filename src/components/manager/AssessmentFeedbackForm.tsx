import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  salesRepId: z.string().min(1, 'Sales representative is required'),
  assessmentId: z.string().min(1, 'Assessment is required'),
  criteriaScores: z.record(z.number().min(1).max(5)),
  observedStrengths: z.string().min(1, 'Observed strengths are required'),
  areasForImprovement: z.string().min(1, 'Areas for improvement are required'),
  recommendedActions: z.string().min(1, 'Recommended actions are required'),
  feedback: z.string().min(1, 'Additional feedback is required'),
});

type FormData = z.infer<typeof formSchema>;

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

export function AssessmentFeedbackForm() {
  const [selectedAssessment, setSelectedAssessment] = useState<string>('');
  const { toast } = useToast();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      salesRepId: '',
      assessmentId: '',
      criteriaScores: {},
      observedStrengths: '',
      areasForImprovement: '',
      recommendedActions: '',
      feedback: '',
    },
  });

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
    mutationFn: async (data: FormData) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('No authenticated user found');

      // Calculate total score
      const scores = Object.values(data.criteriaScores);
      const totalScore = scores.reduce((a, b) => a + b, 0) / scores.length;

      // Create assessment submission
      const { data: submission, error: submissionError } = await supabase
        .from('assessment_submissions')
        .insert({
          assessment_id: data.assessmentId,
          sales_rep_id: data.salesRepId,
          manager_id: user.data.user.id,
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
      
      return submission;
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
      console.error('Submission error:', error);
      toast({
        title: "Error",
        description: "Failed to submit assessment feedback. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    // Validate that all criteria have scores
    if (criteria && criteria.length > 0) {
      const hasAllScores = criteria.every(criterion => 
        data.criteriaScores[criterion.id] !== undefined
      );
      
      if (!hasAllScores) {
        toast({
          title: "Validation Error",
          description: "Please provide scores for all criteria",
          variant: "destructive",
        });
        return;
      }
    }

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
              <FormMessage />
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
              <FormMessage />
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
                <FormMessage />
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
              <FormMessage />
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
              <FormMessage />
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
              <FormMessage />
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
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full"
          disabled={submitMutation.isPending}
        >
          {submitMutation.isPending ? 'Submitting...' : 'Submit Feedback'}
        </Button>
      </form>
    </Form>
  );
}