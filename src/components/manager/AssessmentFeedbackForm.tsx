import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase, getCurrentUserCompanyId } from '@/integrations/supabase/client';
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

const formSchema = z.object({
  salesRepId: z.string().min(1, 'Sales representative is required'),
  assessmentId: z.string().min(1, 'Assessment is required'),
  criteriaScores: z.record(z.number().min(1).max(5)),
  observedStrengths: z.string().min(1, 'Observed strengths are required'),
  areasForImprovement: z.string().min(1, 'Areas for improvement are required'),
  recommendedActions: z.string().min(1, 'Recommended actions are required'),
  feedback: z.string().optional(), // Made feedback optional
});

type FormData = z.infer<typeof formSchema>;

interface AssessmentFeedbackFormProps {
  submissionId?: string | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export function AssessmentFeedbackForm({ submissionId, onCancel, onSuccess }: AssessmentFeedbackFormProps) {
  const { toast } = useToast();
  const [selectedAssessment, setSelectedAssessment] = useState<string>('');
  const [companyId, setCompanyId] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCompanyId = async () => {
      try {
        const id = await getCurrentUserCompanyId();
        setCompanyId(id);
      } catch (error) {
        console.error('Error fetching company ID:', error);
        toast({
          title: "Error",
          description: "Failed to fetch company information",
          variant: "destructive",
        });
      }
    };
    fetchCompanyId();
  }, [toast]);

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

  // Fetch existing submission if editing
  const { data: existingSubmission } = useQuery({
    queryKey: ['submission', submissionId],
    queryFn: async () => {
      if (!submissionId) return null;
      console.log('Fetching submission:', submissionId);
      const { data, error } = await supabase
        .from('assessment_submissions')
        .select(`
          *,
          criteria_scores:assessment_criteria_scores(
            criteria_id,
            score
          )
        `)
        .eq('id', submissionId)
        .single();
      
      if (error) {
        console.error('Error fetching submission:', error);
        throw error;
      }
      console.log('Fetched submission:', data);
      return data;
    },
    enabled: !!submissionId,
  });

  // Set form values when editing existing submission
  useEffect(() => {
    if (existingSubmission) {
      console.log('Setting form values from existing submission:', existingSubmission);
      const criteriaScores = {};
      existingSubmission.criteria_scores.forEach((score: any) => {
        criteriaScores[score.criteria_id] = score.score;
      });

      form.reset({
        salesRepId: existingSubmission.sales_rep_id,
        assessmentId: existingSubmission.assessment_id,
        criteriaScores,
        observedStrengths: existingSubmission.observed_strengths,
        areasForImprovement: existingSubmission.areas_for_improvement,
        recommendedActions: existingSubmission.recommended_actions,
        feedback: existingSubmission.feedback || '',
      });
      setSelectedAssessment(existingSubmission.assessment_id);
    }
  }, [existingSubmission, form]);

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

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (!submissionId || !companyId) throw new Error('Missing required IDs');
      
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('No authenticated user found');

      const scores = Object.values(data.criteriaScores);
      const totalScore = scores.reduce((a, b) => a + b, 0) / scores.length;

      // Update submission
      const { error: submissionError } = await supabase
        .from('assessment_submissions')
        .update({
          assessment_id: data.assessmentId,
          sales_rep_id: data.salesRepId,
          company_id: companyId,
          total_score: totalScore,
          feedback: data.feedback,
          observed_strengths: data.observedStrengths,
          areas_for_improvement: data.areasForImprovement,
          recommended_actions: data.recommendedActions,
          updated_at: new Date().toISOString(),
        })
        .eq('id', submissionId);

      if (submissionError) throw submissionError;

      // Delete old criteria scores
      const { error: deleteError } = await supabase
        .from('assessment_criteria_scores')
        .delete()
        .eq('submission_id', submissionId);

      if (deleteError) throw deleteError;

      // Insert new criteria scores
      const criteriaScores = Object.entries(data.criteriaScores).map(([criteriaId, score]) => ({
        submission_id: submissionId,
        criteria_id: criteriaId,
        score,
        company_id: companyId
      }));

      const { error: insertError } = await supabase
        .from('assessment_criteria_scores')
        .insert(criteriaScores);

      if (insertError) throw insertError;
    },
    onSuccess,
    onError: (error) => {
      console.error('Update error:', error);
      toast({
        title: "Error",
        description: "Failed to update feedback",
        variant: "destructive",
      });
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (!companyId) throw new Error('No company ID available');
      
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('No authenticated user found');

      const scores = Object.values(data.criteriaScores);
      const totalScore = scores.reduce((a, b) => a + b, 0) / scores.length;

      // Create assessment submission
      const { data: submission, error: submissionError } = await supabase
        .from('assessment_submissions')
        .insert({
          assessment_id: data.assessmentId,
          sales_rep_id: data.salesRepId,
          manager_id: user.data.user.id,
          company_id: companyId,
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
        company_id: companyId
      }));

      const { error: scoresError } = await supabase
        .from('assessment_criteria_scores')
        .insert(criteriaScores);

      if (scoresError) throw scoresError;

      return submission;
    },
    onSuccess,
    onError: (error) => {
      console.error('Submission error:', error);
      toast({
        title: "Error",
        description: "Failed to submit assessment feedback",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    console.log('Form submitted with data:', data);
    
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

    if (submissionId) {
      updateMutation.mutate(data);
    } else {
      submitMutation.mutate(data);
    }
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
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={updateMutation.isPending || submitMutation.isPending}
          >
            {submissionId ? 'Update Feedback' : 'Submit Feedback'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
