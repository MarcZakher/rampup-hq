import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TrainingModule {
  id: string;
  period_id: string;
  title: string;
  description: string;
  duration: string;
  platform: string | null;
  sort_order: number;
}

interface TrainingModuleManagerProps {
  initialData?: TrainingModule[];
}

export function TrainingModuleManager({ initialData }: TrainingModuleManagerProps) {
  const [modules, setModules] = useState<TrainingModule[]>([]);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<TrainingModule | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      setModules(initialData);
      setIsLoading(false);
    } else {
      fetchModules();
    }
  }, [initialData]);

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

  const addModule = async (periodId: string) => {
    const newModule = {
      period_id: periodId,
      title: "New Module",
      description: "Enter module description",
      duration: "1 week",
      platform: null,
      sort_order: modules.filter(m => m.period_id === periodId).length + 1
    };

    try {
      const { error } = await supabase
        .from('training_modules')
        .insert(newModule);

      if (error) throw error;

      toast({
        title: "Success",
        description: "New module added successfully",
      });

      fetchModules();
    } catch (error) {
      console.error('Error adding module:', error);
      toast({
        title: "Error",
        description: "Failed to add new module",
        variant: "destructive",
      });
    }
  };

  const renderModuleCard = (module: TrainingModule) => (
    <Card key={module.id} className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">
          {editingId === module.id ? (
            <Input
              value={editingData?.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              className="max-w-sm"
            />
          ) : (
            module.title
          )}
        </CardTitle>
        <div className="flex items-center gap-2">
          {editingId === module.id ? (
            <>
              <Button variant="ghost" size="sm" onClick={saveChanges}>
                <Save className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={cancelEditing}>
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => startEditing(module)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => deleteModule(module.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {editingId === module.id ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Description</label>
              <Input
                value={editingData?.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium">Duration</label>
                <Input
                  value={editingData?.duration || ''}
                  onChange={(e) => handleChange('duration', e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium">Platform</label>
                <Input
                  value={editingData?.platform || ''}
                  onChange={(e) => handleChange('platform', e.target.value)}
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-4">{module.description}</p>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>{module.duration}</span>
              {module.platform && (
                <span className="bg-gray-100 px-2 py-1 rounded">
                  {module.platform}
                </span>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );

  const periods = ['month1', 'month2', 'month3', 'month4'];
  const periodNames = ['Month 1', 'Month 2', 'Month 3', 'Month 4'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Training Modules</h2>
      </div>

      <Tabs defaultValue="month1" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          {periodNames.map((name, index) => (
            <TabsTrigger key={periods[index]} value={periods[index]}>
              {name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {periods.map((period, index) => (
          <TabsContent key={period} value={period}>
            <div className="space-y-4">
              <Button 
                onClick={() => addModule(period)}
                className="w-full flex items-center justify-center gap-2 mb-4"
              >
                <BookPlus className="h-4 w-4" />
                Add Module to {periodNames[index]}
              </Button>
              <div className="grid gap-4">
                {modules
                  .filter(module => module.period_id === period)
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map(renderModuleCard)}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
