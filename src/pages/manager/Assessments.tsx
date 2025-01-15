import React from "react";
import { CustomAppLayout } from "@/components/Layout/CustomAppLayout";
import { AssessmentFeedbackForm } from "@/components/manager/AssessmentFeedbackForm";

export default function ManagerAssessments() {
  return (
    <CustomAppLayout>
      <div className="container mx-auto py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-6">Assessment Feedback</h1>
          <AssessmentFeedbackForm />
        </div>
      </div>
    </CustomAppLayout>
  );
}