import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  full_name: string;
}

interface FeedbackTemplate {
  id: string;
  assessment_name: string;
  form_structure: Record<string, any>;
}

const FeedbackToReps = () => {
  const [selectedRep, setSelectedRep] = useState<string>('');
  const [selectedAssessment, setSelectedAssessment] = useState<string>('');

  // Fetch sales reps managed by the current manager
  const { data: salesReps, isLoading: isLoadingReps } = useQuery({
    queryKey: ['salesReps'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', (
          await supabase
            .from('user_roles')
            .select('user_id')
            .eq('manager_id', user.id)
            .eq('role', 'sales_rep')
        ).data?.map(row => row.user_id) || []);

      if (error) throw error;
      return profiles as Profile[];
    }
  });

  // Fetch feedback templates
  const { data: templates, isLoading: isLoadingTemplates } = useQuery({
    queryKey: ['feedbackTemplates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feedback_form_templates')
        .select('*');

      if (error) throw error;
      return data as FeedbackTemplate[];
    }
  });

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Feedback to Reps</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Create New Feedback</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Sales Rep</label>
              <Select
                value={selectedRep}
                onValueChange={setSelectedRep}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a sales rep" />
                </SelectTrigger>
                <SelectContent>
                  {salesReps?.map((rep) => (
                    <SelectItem key={rep.id} value={rep.id}>
                      {rep.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Select Assessment</label>
              <Select
                value={selectedAssessment}
                onValueChange={setSelectedAssessment}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an assessment" />
                </SelectTrigger>
                <SelectContent>
                  {templates?.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.assessment_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default FeedbackToReps;