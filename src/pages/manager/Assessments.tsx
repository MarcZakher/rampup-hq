import { useState } from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { AssessmentFeedbackForm } from '@/components/manager/AssessmentFeedbackForm';
import { FeedbackHistory } from '@/components/manager/FeedbackHistory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AssessmentsPage = () => {
  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Assessments</h1>
        
        <FeedbackHistory />
        
        <Card>
          <CardHeader>
            <CardTitle>Assessment Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <AssessmentFeedbackForm />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AssessmentsPage;