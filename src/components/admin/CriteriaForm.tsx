import React from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

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

  const handleSubmit = async (data: CriteriaFormData) => {
    try {
      await onSubmit(data);
      form.reset();
      toast({
        title: initialData ? "Criteria Updated" : "Criteria Added",
        description: initialData 
          ? "The criteria has been updated successfully."
          : "New criteria has been added successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save criteria. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Criteria Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter criteria title" />
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
                <Textarea 
                  {...field} 
                  placeholder="Enter criteria description"
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel} type="button">
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