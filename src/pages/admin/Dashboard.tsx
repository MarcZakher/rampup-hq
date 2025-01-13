import { CustomAppLayout } from "@/components/Layout/CustomAppLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Target } from "lucide-react";
import { RampingPeriodTable } from "@/components/RampingPeriodTable";

export default function AdminDashboard() {
  const { data: modules, isLoading } = useQuery({
    queryKey: ['training-modules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('training_modules')
        .select('*')
        .order('period_id', { ascending: true })
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data;
    }
  });

  const { data: rampingData, isLoading: isRampingLoading } = useQuery({
    queryKey: ['ramping-expectations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ramping_expectations')
        .select('*')
        .order('metric');

      if (error) throw error;
      return data;
    }
  });

  return (
    <CustomAppLayout>
      <div className="container mx-auto py-8 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Module
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Ramping Expectations</CardTitle>
            <Target className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent>
            <RampingPeriodTable 
              initialData={rampingData} 
              isLoading={isRampingLoading} 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Training Modules</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">Loading modules...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Sort Order</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modules?.map((module) => (
                    <TableRow key={module.id}>
                      <TableCell className="font-medium">{module.period_id}</TableCell>
                      <TableCell>{module.title}</TableCell>
                      <TableCell className="max-w-md truncate">{module.description}</TableCell>
                      <TableCell>{module.duration}</TableCell>
                      <TableCell>{module.platform || '-'}</TableCell>
                      <TableCell>{module.sort_order}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </CustomAppLayout>
  );
}