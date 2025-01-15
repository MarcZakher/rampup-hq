import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { CustomAppLayout } from "@/components/Layout/CustomAppLayout";
import { Plus, Edit, Trash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { Database } from "@/integrations/supabase/types";

type AssessmentCriteriaTemplate = Database["public"]["Tables"]["assessment_criteria_templates"]["Row"];

interface CriteriaForm {
  name: string;
  description: string;
}

interface AssessmentForm {
  assessment_name: string;
  criteria: CriteriaForm[];
}

interface AssessmentTemplate {
  id: string;
  assessment_name: string;
  criteria_list: CriteriaForm[];
  created_at: string;
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const [isAddingAssessment, setIsAddingAssessment] = useState(false);
  const form = useForm<AssessmentForm>({
    defaultValues: {
      assessment_name: "",
      criteria: [{ name: "", description: "" }],
    },
  });

  const { data: assessments, refetch } = useQuery({
    queryKey: ["assessmentTemplates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assessment_criteria_templates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform the data to match our frontend type
      return (data as AssessmentCriteriaTemplate[]).map((template) => ({
        id: template.id,
        assessment_name: template.assessment_name,
        criteria_list: template.criteria_list as CriteriaForm[],
        created_at: template.created_at,
      })) as AssessmentTemplate[];
    },
  });

  const addCriteria = () => {
    const currentCriteria = form.getValues("criteria");
    form.setValue("criteria", [...currentCriteria, { name: "", description: "" }]);
  };

  const removeCriteria = (index: number) => {
    const currentCriteria = form.getValues("criteria");
    form.setValue(
      "criteria",
      currentCriteria.filter((_, i) => i !== index)
    );
  };

  const onSubmit = async (data: AssessmentForm) => {
    try {
      const { error } = await supabase.from("assessment_criteria_templates").insert({
        assessment_name: data.assessment_name,
        criteria_list: data.criteria,
      } as AssessmentCriteriaTemplate);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Assessment template created successfully",
      });

      setIsAddingAssessment(false);
      form.reset();
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create assessment template",
        variant: "destructive",
      });
    }
  };

  const deleteAssessment = async (id: string) => {
    try {
      const { error } = await supabase
        .from("assessment_criteria_templates")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Assessment template deleted successfully",
      });

      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete assessment template",
        variant: "destructive",
      });
    }
  };

  return (
    <CustomAppLayout>
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Assessment Management</h1>
          <Sheet open={isAddingAssessment} onOpenChange={setIsAddingAssessment}>
            <SheetTrigger asChild>
              <Button>
                <Plus className="mr-2" />
                Add Assessment
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Create New Assessment</SheetTitle>
              </SheetHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
                  <FormField
                    control={form.control}
                    name="assessment_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assessment Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Criteria</h3>
                      <Button type="button" variant="outline" onClick={addCriteria}>
                        <Plus className="mr-2" />
                        Add Criteria
                      </Button>
                    </div>

                    {form.watch("criteria").map((_, index) => (
                      <div key={index} className="space-y-4 p-4 border rounded-lg">
                        <FormField
                          control={form.control}
                          name={`criteria.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Criteria Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`criteria.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => removeCriteria(index)}
                          >
                            <Trash className="mr-2" />
                            Remove Criteria
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <Button type="submit" className="w-full">
                    Create Assessment
                  </Button>
                </form>
              </Form>
            </SheetContent>
          </Sheet>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Assessment Name</TableHead>
                <TableHead>Number of Criteria</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assessments?.map((assessment) => (
                <TableRow key={assessment.id}>
                  <TableCell>{assessment.assessment_name}</TableCell>
                  <TableCell>{assessment.criteria_list.length}</TableCell>
                  <TableCell>
                    {new Date(assessment.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteAssessment(assessment.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </CustomAppLayout>
  );
}