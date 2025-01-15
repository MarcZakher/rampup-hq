import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';

interface SalesRep {
  id: string;
  name: string;
}

interface AssessmentFeedbackFormProps {
  salesReps: SalesRep[];
  assessments: { name: string; shortName: string }[];
}

export const AssessmentFeedbackForm = ({ salesReps, assessments }: AssessmentFeedbackFormProps) => {
  const [selectedRep, setSelectedRep] = useState<string>('');
  const [selectedAssessment, setSelectedAssessment] = useState<string>('');
  const [feedback, setFeedback] = useState('');
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!selectedRep || !selectedAssessment || !feedback.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('feedback_submissions')
        .insert({
          sales_rep_id: selectedRep,
          manager_id: (await supabase.auth.getUser()).data.user?.id,
          template_id: selectedAssessment,
          feedback_data: { feedback }
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Feedback submitted successfully"
      });

      // Reset form
      setSelectedRep('');
      setSelectedAssessment('');
      setFeedback('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: "Failed to submit feedback",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Assessment Feedback</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Sales Representative
          </label>
          <Select value={selectedRep} onValueChange={setSelectedRep}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a sales rep" />
            </SelectTrigger>
            <SelectContent>
              {salesReps.map((rep) => (
                <SelectItem key={rep.id} value={rep.id}>
                  {rep.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Assessment
          </label>
          <Select value={selectedAssessment} onValueChange={setSelectedAssessment}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an assessment" />
            </SelectTrigger>
            <SelectContent>
              {assessments.map((assessment, index) => (
                <SelectItem key={index} value={assessment.name}>
                  {assessment.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Feedback
          </label>
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Enter your feedback here..."
            className="min-h-[100px]"
          />
        </div>

        <Button onClick={handleSubmit} className="w-full">
          Submit Feedback
        </Button>
      </CardContent>
    </Card>
  );
};