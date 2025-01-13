import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type TrainingPeriod = "month_1" | "month_2" | "month_3" | "month_4";

interface TrainingModuleForm {
  title: string;
  description: string;
  period: TrainingPeriod;
  duration: string;
  platform?: string;
  sort_order: number;
}

export function TrainingJourneyManager() {
  const { toast } = useToast();
  const [modules, setModules] = useState<any[]>([]);
  const [editingModule, setEditingModule] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<TrainingPeriod>("month_1");

  const form = useForm<TrainingModuleForm>({
    defaultValues: {
      title: "",
      description: "",
      period: "month_1",
      duration: "",
      platform: "",
      sort_order: 0,
    },
  });

  const loadModules = async () => {
    const { data, error } = await supabase
      .from("training_journey_modules")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load training modules",
        variant: "destructive",
      });
      return;
    }

    setModules(data || []);
  };

  const onSubmit = async (values: TrainingModuleForm) => {
    const operation = editingModule
      ? supabase
          .from("training_journey_modules")
          .update(values)
          .eq("id", editingModule.id)
      : supabase.from("training_journey_modules").insert(values);

    const { error } = await operation;

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save training module",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: `Training module ${editingModule ? "updated" : "created"} successfully`,
    });

    form.reset();
    setEditingModule(null);
    loadModules();
  };

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
    setActiveTab(module.period);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("training_journey_modules")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete training module",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Training module deleted successfully",
    });

    loadModules();
  };

  const filteredModules = (period: TrainingPeriod) =>
    modules.filter((module) => module.period === period);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {editingModule ? "Edit Training Module" : "Add Training Module"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="period"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Period</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a period" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="month_1">Month 1</SelectItem>
                        <SelectItem value="month_2">Month 2</SelectItem>
                        <SelectItem value="month_3">Month 3</SelectItem>
                        <SelectItem value="month_4">Month 4</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Udemy" />
                    </FormControl>
                    <FormMessage />
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
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value, 10))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                {editingModule && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingModule(null);
                      form.reset();
                    }}
                  >
                    Cancel
                  </Button>
                )}
                <Button type="submit">
                  {editingModule ? "Update" : "Add"} Module
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={(value: TrainingPeriod) => setActiveTab(value)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="month_1">Month 1</TabsTrigger>
          <TabsTrigger value="month_2">Month 2</TabsTrigger>
          <TabsTrigger value="month_3">Month 3</TabsTrigger>
          <TabsTrigger value="month_4">Month 4</TabsTrigger>
        </TabsList>

        {(["month_1", "month_2", "month_3", "month_4"] as TrainingPeriod[]).map((period) => (
          <TabsContent key={period} value={period}>
            <div className="grid gap-4">
              {filteredModules(period).map((module) => (
                <Card key={module.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{module.title}</CardTitle>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(module)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(module.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-gray-600">{module.description}</p>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>Duration: {module.duration}</span>
                        {module.platform && <span>Platform: {module.platform}</span>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}