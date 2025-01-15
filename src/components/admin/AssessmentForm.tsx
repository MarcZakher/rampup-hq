import React from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AssessmentFormProps {
  onSubmit: (data: AssessmentFormData) => void;
  initialData?: AssessmentFormData;
  onCancel: () => void;
}

export interface AssessmentFormData {
  title: string;
  description: string;
  period: "month_1" | "month_2" | "month_3" | "month_4";
}

export function AssessmentForm({ onSubmit, initialData, onCancel }: AssessmentFormProps) {
  const form = useForm<AssessmentFormData>({
    defaultValues: initialData || {
      title: "",
      description: "",
      period: "month_1",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? "Update Assessment" : "Create Assessment"}
          </Button>
        </div>
      </form>
    </Form>
  );
}