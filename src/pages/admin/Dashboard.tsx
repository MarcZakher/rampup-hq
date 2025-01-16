import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { CustomAppLayout } from "@/components/Layout/CustomAppLayout";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { AssessmentForm, AssessmentFormData } from "@/components/admin/AssessmentForm";
import { CriteriaForm, CriteriaFormData } from "@/components/admin/CriteriaForm";
import { AssessmentList } from "@/components/admin/AssessmentList";
import { CriteriaList } from "@/components/admin/CriteriaList";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { getCurrentUserCompanyId } from "@/utils/auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash } from "lucide-react";

export default function AdminDashboard() {
  const { toast } = useToast();
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [isAddingAssessment, setIsAddingAssessment] = useState(false);
  const [isManagingCriteria, setIsManagingCriteria] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [editingAssessment, setEditingAssessment] = useState<any>(null);
  const [editingCriteria, setEditingCriteria] = useState<any>(null);
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null);

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      period: "month_1",
      duration: "",
      platform: "",
      sort_order: 0,
    },
  });

  const { data: modules, refetch: refetchModules } = useQuery({
    queryKey: ["trainingModules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("training_journey_modules")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const { data: assessments, refetch: refetchAssessments } = useQuery({
    queryKey: ["assessments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assessments")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: criteria, refetch: refetchCriteria } = useQuery({
    queryKey: ["criteria", selectedAssessment?.id],
    queryFn: async () => {
      if (!selectedAssessment?.id) return [];
      const { data, error } = await supabase
        .from("assessment_criteria")
        .select("*")
        .eq("assessment_id", selectedAssessment.id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!selectedAssessment?.id,
  });

  const handleEdit = (module: any) => {
    setEditingModule(module);
    form.reset({
      title: module.title,
      description: module.description,
      period: module.period,
      duration: module.duration,
      platform: module.platform || "",
      sort_order: module.sort_order,
    });
    setIsAddingModule(true);
  };

  const onSubmit = async (data: any) => {
    try {
      const company_id = await getCurrentUserCompanyId();
      
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
          company_id,
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
      form.reset();
      refetchModules();
    } catch (error) {
      toast({
        title: "Error",
        description: editingModule 
          ? "Failed to update training module"
          : "Failed to create training module",
        variant: "destructive",
      });
    }
  };

  const handleAssessmentSubmit = async (data: AssessmentFormData) => {
    try {
      const company_id = await getCurrentUserCompanyId();
      
      if (editingAssessment) {
        const { error } = await supabase
          .from("assessments")
          .update({
            ...data,
            company_id
          })
          .eq("id", editingAssessment.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Assessment updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("assessments")
          .insert({
            ...data,
            company_id
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Assessment created successfully",
        });
      }

      setIsAddingAssessment(false);
      setEditingAssessment(null);
      refetchAssessments();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save assessment",
        variant: "destructive",
      });
    }
  };

  const handleCriteriaSubmit = async (data: CriteriaFormData) => {
    try {
      const company_id = await getCurrentUserCompanyId();
      
      if (editingCriteria) {
        const { error } = await supabase
          .from("assessment_criteria")
          .update({
            ...data,
            company_id
          })
          .eq("id", editingCriteria.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Criteria updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("assessment_criteria")
          .insert({
            ...data,
            assessment_id: selectedAssessment.id,
            company_id
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Criteria created successfully",
        });
      }

      setEditingCriteria(null);
      refetchCriteria();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save criteria",
        variant: "destructive",
      });
    }
  };

  return (
    <CustomAppLayout>
      <div className="container mx-auto py-8 space-y-12">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Training Module Management</h1>
            <Sheet open={isAddingModule} onOpenChange={setIsAddingModule}>
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
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="period"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Period</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select period" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="month_1">Month 1</SelectItem>
                              <SelectItem value="month_2">Month 2</SelectItem>
                              <SelectItem value="month_3">Month 3</SelectItem>
                              <SelectItem value="month_4">Month 4</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., 2 hours" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="platform"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Platform</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., Zoom, Google Meet" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sort_order"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sort Order</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full">
                      {editingModule ? "Update Module" : "Create Module"}
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
                  <TableHead>Title</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Sort Order</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modules?.map((module) => (
                  <TableRow key={module.id}>
                    <TableCell>{module.title}</TableCell>
                    <TableCell>Month {module.period.split("_")[1]}</TableCell>
                    <TableCell>{module.duration}</TableCell>
                    <TableCell>{module.platform}</TableCell>
                    <TableCell>{module.sort_order}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEdit(module)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteModule(module.id)}
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
            assessments={assessments || []}
            onEdit={(assessment) => {
              setEditingAssessment(assessment);
              setIsAddingAssessment(true);
            }}
            onDelete={handleDeleteAssessment}
            onManageCriteria={(assessment) => {
              setSelectedAssessment(assessment);
              setIsManagingCriteria(true);
            }}
          />
        </div>

        <Sheet open={isManagingCriteria} onOpenChange={setIsManagingCriteria}>
          <SheetContent className="w-full sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>
                Manage Criteria for {selectedAssessment?.title}
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Criteria List</h2>
                <Button
                  onClick={() => {
                    setEditingCriteria(null);
                  }}
                >
                  <Plus className="mr-2" />
                  Add Criteria
                </Button>
              </div>

              {editingCriteria === null && (
                <CriteriaForm
                  onSubmit={handleCriteriaSubmit}
                  onCancel={() => setEditingCriteria(undefined)}
                />
              )}

              <CriteriaList
                criteria={criteria || []}
                onEdit={setEditingCriteria}
                onDelete={handleDeleteCriteria}
                onAdd={handleCriteriaSubmit}
                selectedAssessment={selectedAssessment}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </CustomAppLayout>
  );
}
