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

interface CriteriaFormProps {
  onSubmit: (data: CriteriaFormData) => void;
  initialData?: CriteriaFormData;
  onCancel: () => void;
}

export interface CriteriaFormData {
  title: string;
  description: string;
}

export function CriteriaForm({ onSubmit, initialData, onCancel }: CriteriaFormProps) {
  const form = useForm<CriteriaFormData>({
    defaultValues: initialData || {
      title: "",
      description: "",
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
              <FormLabel>Criteria Title</FormLabel>
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

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? "Update Criteria" : "Add Criteria"}
          </Button>
        </div>
      </form>
    </Form>
  );
}