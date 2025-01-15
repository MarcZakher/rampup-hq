import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AssessmentFeedbackFormData {
  salesRepId: string;
  assessmentId: string;
  criteriaScores: { [key: string]: number };
  observedStrengths: string;
  areasForImprovement: string;
  recommendedActions: string;
  feedback: string;
}

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
  const { toast } = useToast();
  const [salesReps, setSalesReps] = useState<SalesRep[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [criteria, setCriteria] = useState<Criteria[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<AssessmentFeedbackFormData>({
    defaultValues: {
      salesRepId: "",
      assessmentId: "",
      criteriaScores: {},
      observedStrengths: "",
      areasForImprovement: "",
      recommendedActions: "",
      feedback: "",
    },
  });

  useEffect(() => {
    fetchSalesReps();
    fetchAssessments();
  }, []);

  const fetchSalesReps = async () => {
    const { data: roles } = await supabase
      .from("user_roles")
      .select("user_id, profiles(id, full_name)")
      .eq("role", "sales_rep");

    if (roles) {
      const reps = roles
        .map((role) => ({
          id: role.user_id!,
          full_name: (role.profiles as any)?.full_name || "Unknown",
        }))
        .filter((rep) => rep.id);
      setSalesReps(reps);
    }
  };

  const fetchAssessments = async () => {
    const { data } = await supabase
      .from("assessments")
      .select("id, title")
      .order("created_at", { ascending: false });

    if (data) {
      setAssessments(data);
    }
  };

  const fetchCriteria = async (assessmentId: string) => {
    const { data } = await supabase
      .from("assessment_criteria")
      .select("id, title")
      .eq("assessment_id", assessmentId)
      .order("created_at", { ascending: true });

    if (data) {
      setCriteria(data);
      // Initialize scores for all criteria
      const initialScores = data.reduce((acc, criterion) => {
        acc[criterion.id] = 1;
        return acc;
      }, {} as { [key: string]: number });
      form.setValue("criteriaScores", initialScores);
    }
  };

  const handleAssessmentChange = (assessmentId: string) => {
    form.setValue("assessmentId", assessmentId);
    fetchCriteria(assessmentId);
  };

  const onSubmit = async (data: AssessmentFeedbackFormData) => {
    try {
      setLoading(true);

      // Calculate total score (average of all criteria scores)
      const totalScore =
        Object.values(data.criteriaScores).reduce((a, b) => a + b, 0) /
        Object.values(data.criteriaScores).length;

      // Create assessment submission
      const { data: submission, error: submissionError } = await supabase
        .from("assessment_submissions")
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
      const criteriaScores = Object.entries(data.criteriaScores).map(
        ([criteriaId, score]) => ({
          submission_id: submission.id,
          criteria_id: criteriaId,
          score,
        })
      );

      const { error: scoresError } = await supabase
        .from("assessment_criteria_scores")
        .insert(criteriaScores);

      if (scoresError) throw scoresError;

      toast({
        title: "Success",
        description: "Assessment feedback submitted successfully",
      });

      // Reset form
      form.reset();
      setCriteria([]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to submit assessment feedback",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sales rep" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {salesReps.map((rep) => (
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
                onValueChange={handleAssessmentChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assessment" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {assessments.map((assessment) => (
                    <SelectItem key={assessment.id} value={assessment.id}>
                      {assessment.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        {criteria.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Criteria Scores</h3>
            {criteria.map((criterion) => (
              <FormField
                key={criterion.id}
                control={form.control}
                name={`criteriaScores.${criterion.id}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{criterion.title}</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select score" />
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
          </div>
        )}

        <FormField
          control={form.control}
          name="observedStrengths"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observed Strengths</FormLabel>
              <FormControl>
                <Textarea {...field} />
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
                <Textarea {...field} />
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
                <Textarea {...field} />
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
                <Textarea {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Feedback"}
        </Button>
      </form>
    </Form>
  );
}