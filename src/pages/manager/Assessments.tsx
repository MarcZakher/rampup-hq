import { useState } from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { AssessmentFeedbackForm } from '@/components/manager/AssessmentFeedbackForm';
import { FeedbackList } from '@/components/manager/FeedbackList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const AssessmentsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    setEditingId(id);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingId(null);
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Assessments</h1>
          {!showForm && (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Feedback
            </Button>
          )}
        </div>

        {showForm ? (
          <Card>
            <CardHeader>
              <CardTitle>
                {editingId ? 'Edit Feedback' : 'New Feedback'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AssessmentFeedbackForm
                submissionId={editingId}
                onCancel={handleFormClose}
                onSuccess={handleFormClose}
              />
            </CardContent>
          </Card>
        ) : (
          <FeedbackList onEdit={handleEdit} />
        )}
      </div>
    </AppLayout>
  );
};

export default AssessmentsPage;