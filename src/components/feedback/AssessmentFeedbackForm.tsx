import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
import { Plus, Minus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Database, Json } from '@/integrations/supabase/types';

interface SalesRep {
  id: string;
  name: string;
}

interface AssessmentFeedbackFormProps {
  salesReps: SalesRep[];
}

type AssessmentCriteria = {
  id: string;
  name: string;
  description: string;
};

type AssessmentTemplate = Database['public']['Tables']['assessment_criteria_templates']['Row'] & {
  criteria_list: AssessmentCriteria[];
};

export const AssessmentFeedbackForm = ({ salesReps }: AssessmentFeedbackFormProps) => {
  const [selectedRep, setSelectedRep] = useState<string>('');
  const [selectedAssessment, setSelectedAssessment] = useState<string>('');
  const [scores, setScores] = useState<Record<string, number>>({});
  const [strengths, setStrengths] = useState<string[]>(['']);
  const [improvements, setImprovements] = useState<string[]>(['']);
  const [actions, setActions] = useState<string[]>(['']);
  const { toast } = useToast();

  const { data: assessments } = useQuery({
    queryKey: ['assessmentTemplates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assessment_criteria_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data.map(template => ({
        ...template,
        criteria_list: (template.criteria_list as unknown) as AssessmentCriteria[]
      }));
    },
  });

  const handleScoreChange = (criteriaId: string, value: string) => {
    const score = parseFloat(value);
    if (isNaN(score) || score < 1 || score > 5) return;
    
    setScores(prev => ({
      ...prev,
      [criteriaId]: score
    }));
  };

  const handleArrayFieldAdd = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    currentArray: string[]
  ) => {
    setter([...currentArray, '']);
  };

  const handleArrayFieldRemove = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    currentArray: string[],
    index: number
  ) => {
    if (currentArray.length > 1) {
      setter(currentArray.filter((_, i) => i !== index));
    }
  };

  const handleArrayFieldChange = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    currentArray: string[],
    index: number,
    value: string
  ) => {
    const newArray = [...currentArray];
    newArray[index] = value;
    setter(newArray);
  };

  const handleSubmit = async () => {
    if (!selectedRep || !selectedAssessment) {
      toast({
        title: "Error",
        description: "Please select a sales representative and an assessment",
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
          scores: scores as Json,
          observed_strengths: strengths.filter(s => s.trim()),
          areas_for_improvement: improvements.filter(s => s.trim()),
          recommended_actions: actions.filter(s => s.trim())
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Feedback submitted successfully"
      });

      // Reset form
      setSelectedRep('');
      setSelectedAssessment('');
      setScores({});
      setStrengths(['']);
      setImprovements(['']);
      setActions(['']);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: "Failed to submit feedback",
        variant: "destructive"
      });
    }
  };

  const selectedTemplate = assessments?.find(a => a.id === selectedAssessment);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Assessment Feedback</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
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
                {assessments?.map((assessment) => (
                  <SelectItem key={assessment.id} value={assessment.id}>
                    {assessment.assessment_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedTemplate && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Assessment Criteria</h3>
              {selectedTemplate.criteria_list.map((criteria) => (
                <div key={criteria.id} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {criteria.name}
                    <p className="text-sm text-gray-500">{criteria.description}</p>
                  </label>
                  <Select
                    value={scores[criteria.id]?.toString() || ''}
                    onValueChange={(value) => handleScoreChange(criteria.id, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a score (1-5)" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((score) => (
                        <SelectItem key={score} value={score.toString()}>
                          {score}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Observed Strengths</h3>
            {strengths.map((strength, index) => (
              <div key={index} className="flex gap-2">
                <Textarea
                  value={strength}
                  onChange={(e) => handleArrayFieldChange(setStrengths, strengths, index, e.target.value)}
                  placeholder="Enter observed strength..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleArrayFieldAdd(setStrengths, strengths)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                {strengths.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleArrayFieldRemove(setStrengths, strengths, index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Areas for Improvement</h3>
            {improvements.map((improvement, index) => (
              <div key={index} className="flex gap-2">
                <Textarea
                  value={improvement}
                  onChange={(e) => handleArrayFieldChange(setImprovements, improvements, index, e.target.value)}
                  placeholder="Enter area for improvement..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleArrayFieldAdd(setImprovements, improvements)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                {improvements.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleArrayFieldRemove(setImprovements, improvements, index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recommended Actions</h3>
            {actions.map((action, index) => (
              <div key={index} className="flex gap-2">
                <Textarea
                  value={action}
                  onChange={(e) => handleArrayFieldChange(setActions, actions, index, e.target.value)}
                  placeholder="Enter recommended action..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleArrayFieldAdd(setActions, actions)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                {actions.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleArrayFieldRemove(setActions, actions, index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button onClick={handleSubmit} className="w-full">
            Submit Feedback
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};