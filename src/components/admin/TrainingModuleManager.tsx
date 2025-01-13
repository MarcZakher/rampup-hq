import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { BookPlus, Pencil, Save, X, Trash2 } from "lucide-react";

interface TrainingModule {
  id: string;
  period_id: string;
  title: string;
  description: string;
  duration: string;
  platform: string | null;
  sort_order: number;
}

export function TrainingModuleManager() {
  const [modules, setModules] = useState<TrainingModule[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<TrainingModule | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const { data, error } = await supabase
        .from('training_modules')
        .select('*')
        .order('period_id, sort_order');
      
      if (error) throw error;
      setModules(data);
    } catch (error) {
      console.error('Error fetching modules:', error);
      toast({
        title: "Error",
        description: "Failed to load training modules",
        variant: "destructive",
      });
    }
  };

  const startEditing = (module: TrainingModule) => {
    setEditingId(module.id);
    setEditingData({ ...module });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingData(null);
  };

  const handleChange = (field: keyof TrainingModule, value: string | number) => {
    if (!editingData) return;
    setEditingData({
      ...editingData,
      [field]: value,
    });
  };

  const saveChanges = async () => {
    if (!editingData) return;

    try {
      const { error } = await supabase
        .from('training_modules')
        .update(editingData)
        .eq('id', editingData.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Module updated successfully",
      });

      fetchModules();
      cancelEditing();
    } catch (error) {
      console.error('Error updating module:', error);
      toast({
        title: "Error",
        description: "Failed to update module",
        variant: "destructive",
      });
    }
  };

  const deleteModule = async (id: string) => {
    if (!confirm('Are you sure you want to delete this module?')) return;

    try {
      const { error } = await supabase
        .from('training_modules')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Module deleted successfully",
      });

      fetchModules();
    } catch (error) {
      console.error('Error deleting module:', error);
      toast({
        title: "Error",
        description: "Failed to delete module",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Training Modules</h2>
        <Button className="gap-2">
          <BookPlus className="h-4 w-4" />
          Add Module
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Period</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Platform</TableHead>
            <TableHead>Order</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {modules.map((module) => (
            <TableRow key={module.id}>
              <TableCell>
                {editingId === module.id ? (
                  <Input
                    value={editingData?.period_id || ''}
                    onChange={(e) => handleChange('period_id', e.target.value)}
                  />
                ) : (
                  module.period_id
                )}
              </TableCell>
              <TableCell>
                {editingId === module.id ? (
                  <Input
                    value={editingData?.title || ''}
                    onChange={(e) => handleChange('title', e.target.value)}
                  />
                ) : (
                  module.title
                )}
              </TableCell>
              <TableCell>
                {editingId === module.id ? (
                  <Input
                    value={editingData?.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                  />
                ) : (
                  module.description
                )}
              </TableCell>
              <TableCell>
                {editingId === module.id ? (
                  <Input
                    value={editingData?.duration || ''}
                    onChange={(e) => handleChange('duration', e.target.value)}
                  />
                ) : (
                  module.duration
                )}
              </TableCell>
              <TableCell>
                {editingId === module.id ? (
                  <Input
                    value={editingData?.platform || ''}
                    onChange={(e) => handleChange('platform', e.target.value)}
                  />
                ) : (
                  module.platform
                )}
              </TableCell>
              <TableCell>
                {editingId === module.id ? (
                  <Input
                    type="number"
                    value={editingData?.sort_order || 0}
                    onChange={(e) => handleChange('sort_order', parseInt(e.target.value))}
                  />
                ) : (
                  module.sort_order
                )}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {editingId === module.id ? (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={saveChanges}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={cancelEditing}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditing(module)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteModule(module.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}