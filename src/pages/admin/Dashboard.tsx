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
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AssessmentCriteriaTemplate = Database["public"]["Tables"]["assessment_criteria_templates"]["Row"];

interface CriteriaForm {
  id?: string;
  name: string;
  description: string;
}

interface AssessmentForm {
  assessment_name: string;
  criteria: CriteriaForm[];
  month: string;
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const [isAddingAssessment, setIsAddingAssessment] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<AssessmentCriteriaTemplate | null>(null);
  const form = useForm<AssessmentForm>({
    defaultValues: {
      assessment_name: "",
      criteria: [{ name: "", description: "" }],
      month: "1",
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

      return (data as AssessmentCriteriaTemplate[]).map((template) => ({
        ...template,
        criteria_list: template.criteria_list as CriteriaForm[],
      }));
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

  const handleEdit = (assessment: AssessmentCriteriaTemplate) => {
    setEditingAssessment(assessment);
    form.reset({
      assessment_name: assessment.assessment_name,
      criteria: assessment.criteria_list as CriteriaForm[],
      month: assessment.month.toString(),
    });
    setIsAddingAssessment(true);
  };

  const onSubmit = async (data: AssessmentForm) => {
    try {
      const criteriaList = data.criteria.map(({ name, description }) => ({
        id: crypto.randomUUID(),
        name,
        description,
      }));

      if (editingAssessment) {
        const { error } = await supabase
          .from("assessment_criteria_templates")
          .update({
            assessment_name: data.assessment_name,
            criteria_list: criteriaList as unknown as Database["public"]["Tables"]["assessment_criteria_templates"]["Update"]["criteria_list"],
            month: parseInt(data.month),
          })
          .eq("id", editingAssessment.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Assessment template updated successfully",
        });
      } else {
        const { error } = await supabase.from("assessment_criteria_templates").insert({
          assessment_name: data.assessment_name,
          criteria_list: criteriaList as unknown as Database["public"]["Tables"]["assessment_criteria_templates"]["Insert"]["criteria_list"],
          month: parseInt(data.month),
        });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Assessment template created successfully",
        });
      }

      setIsAddingAssessment(false);
      setEditingAssessment(null);
      form.reset();
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: editingAssessment 
          ? "Failed to update assessment template"
          : "Failed to create assessment template",
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

  const handleSheetOpenChange = (open: boolean) => {
    setIsAddingAssessment(open);
    if (!open) {
      setEditingAssessment(null);
      form.reset();
    }
  };

  return (
    <CustomAppLayout>
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Assessment Management</h1>
          <Sheet open={isAddingAssessment} onOpenChange={handleSheetOpenChange}>
            <SheetTrigger asChild>
              <Button>
                <Plus className="mr-2" />
                Add Assessment
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
              <SheetHeader>
                <SheetTitle>
                  {editingAssessment ? "Edit Assessment" : "Create New Assessment"}
                </SheetTitle>
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

                  <FormField
                    control={form.control}
                    name="month"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Month</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select month" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6].map((month) => (
                              <SelectItem key={month} value={month.toString()}>
                                Month {month}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                    {editingAssessment ? "Update Assessment" : "Create Assessment"}
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
                <TableHead>Month</TableHead>
                <TableHead>Number of Criteria</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assessments?.map((assessment) => (
                <TableRow key={assessment.id}>
                  <TableCell>{assessment.assessment_name}</TableCell>
                  <TableCell>Month {assessment.month}</TableCell>
                  <TableCell>{(assessment.criteria_list as CriteriaForm[]).length}</TableCell>
                  <TableCell>
                    {new Date(assessment.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEdit(assessment)}
                      >
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