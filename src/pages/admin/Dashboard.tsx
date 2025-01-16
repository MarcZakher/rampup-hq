import { useState } from "react";
import { CustomAppLayout } from "@/components/Layout/CustomAppLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { AssessmentForm } from "@/components/admin/AssessmentForm";
import { AssessmentList } from "@/components/admin/AssessmentList";
import { TrainingModuleForm } from "@/components/admin/training/TrainingModuleForm";
import { TrainingModuleList } from "@/components/admin/training/TrainingModuleList";

export default function AdminDashboard() {
  const { toast } = useToast();
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [isAddingAssessment, setIsAddingAssessment] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [editingAssessment, setEditingAssessment] = useState<any>(null);
  const [selectedAssessment, setSelectedAssessment] = useState<{ id: string; title: string } | null>(null);

  const handleModuleSubmit = async (data: any) => {
    try {
      if (editingModule) {
        const { error } = await supabase
          .from("training_journey_modules")
          .update({
            title: data.title,
            description: data.description,
            period: data.period,
            duration: data.duration,
            platform: data.platform,
            sort_order: data.sort_order,
          })
          .eq("id", editingModule.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Training module updated successfully",
        });
      } else {
        const { error } = await supabase.from("training_journey_modules").insert({
          title: data.title,
          description: data.description,
          period: data.period,
          duration: data.duration,
          platform: data.platform,
          sort_order: data.sort_order,
        });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Training module created successfully",
        });
      }

      setIsAddingModule(false);
      setEditingModule(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: editingModule 
          ? "Failed to update training module"
          : "Failed to create training module",
        variant: "destructive",
      });
    }
  };

  const deleteModule = async (id: string) => {
    try {
      const { error } = await supabase
        .from("training_journey_modules")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Training module deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete training module",
        variant: "destructive",
      });
    }
  };

  const handleAssessmentSubmit = async (data: any) => {
    try {
      if (editingAssessment) {
        const { error } = await supabase
          .from("assessments")
          .update(data)
          .eq("id", editingAssessment.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Assessment updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("assessments")
          .insert(data);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Assessment created successfully",
        });
      }

      setIsAddingAssessment(false);
      setEditingAssessment(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save assessment",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAssessment = async (id: string) => {
    try {
      const { error } = await supabase
        .from("assessments")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Assessment deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete assessment",
        variant: "destructive",
      });
    }
  };

  const handleSheetOpenChange = (open: boolean) => {
    setIsAddingModule(open);
    if (!open) {
      setEditingModule(null);
    }
  };

  const handleManageCriteria = (assessment: { id: string; title: string }) => {
    setSelectedAssessment(assessment);
  };

  return (
    <CustomAppLayout>
      <div className="container mx-auto py-8 space-y-12">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Training Module Management</h1>
            <Sheet open={isAddingModule} onOpenChange={handleSheetOpenChange}>
              <SheetTrigger asChild>
                <Button>
                  <Plus className="mr-2" />
                  Add Module
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader>
                  <SheetTitle>
                    {editingModule ? "Edit Module" : "Create New Module"}
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <TrainingModuleForm
                    initialData={editingModule}
                    onSubmit={handleModuleSubmit}
                    onCancel={() => {
                      setIsAddingModule(false);
                      setEditingModule(null);
                    }}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <TrainingModuleList
            onEdit={(module) => {
              setEditingModule(module);
              setIsAddingModule(true);
            }}
            onDelete={deleteModule}
          />
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Assessment Management</h1>
            <Sheet open={isAddingAssessment} onOpenChange={setIsAddingAssessment}>
              <SheetTrigger asChild>
                <Button>
                  <Plus className="mr-2" />
                  Add Assessment
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader>
                  <SheetTitle>
                    {editingAssessment ? "Edit Assessment" : "Create New Assessment"}
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <AssessmentForm
                    onSubmit={handleAssessmentSubmit}
                    initialData={editingAssessment}
                    onCancel={() => {
                      setIsAddingAssessment(false);
                      setEditingAssessment(null);
                    }}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <AssessmentList
            assessments={[]}
            onEdit={(assessment) => {
              setEditingAssessment(assessment);
              setIsAddingAssessment(true);
            }}
            onDelete={handleDeleteAssessment}
            onManageCriteria={handleManageCriteria}
          />
        </div>
      </div>
    </CustomAppLayout>
  );
}