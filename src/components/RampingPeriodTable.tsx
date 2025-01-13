import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Save, X } from "lucide-react";
import { Json } from "@/integrations/supabase/types";

interface MonthValue {
  value: string;
  note: string;
}

interface RampingExpectation {
  id: string;
  metric: string;
  month_1: MonthValue;
  month_2: MonthValue;
  month_3: MonthValue;
  month_4: MonthValue;
  month_5: MonthValue;
  month_6: MonthValue;
}

interface RampingPeriodTableProps {
  initialData?: any[];
}

export function RampingPeriodTable({ initialData }: RampingPeriodTableProps) {
  const [rampingData, setRampingData] = useState<RampingExpectation[]>([]);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<RampingExpectation | null>(null);
  const { toast } = useToast();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const parseMonthValue = (value: any): MonthValue => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (e) {
        return { value: '', note: '' };
      }
    }
    return value || { value: '', note: '' };
  };

  useEffect(() => {
    if (initialData) {
      try {
        const parsedData = initialData.map(item => ({
          id: item.id,
          metric: item.metric,
          month_1: parseMonthValue(item.month_1),
          month_2: parseMonthValue(item.month_2),
          month_3: parseMonthValue(item.month_3),
          month_4: parseMonthValue(item.month_4),
          month_5: parseMonthValue(item.month_5),
          month_6: parseMonthValue(item.month_6),
        }));
        setRampingData(parsedData);
      } catch (error) {
        console.error('Error parsing data:', error);
        toast({
          title: "Error",
          description: "Failed to parse ramping expectations data",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    } else {
      fetchRampingData();
    }
  }, [initialData]);

  const fetchRampingData = async () => {
    try {
      const { data, error } = await supabase
        .from("ramping_expectations")
        .select("*")
        .order("metric");

      if (error) throw error;

      const parsedData = data.map(item => ({
        id: item.id,
        metric: item.metric,
        month_1: parseMonthValue(item.month_1),
        month_2: parseMonthValue(item.month_2),
        month_3: parseMonthValue(item.month_3),
        month_4: parseMonthValue(item.month_4),
        month_5: parseMonthValue(item.month_5),
        month_6: parseMonthValue(item.month_6),
      }));

      setRampingData(parsedData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch ramping expectations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (expectation: RampingExpectation) => {
    if (!isAdminRoute) return;
    setEditingId(expectation.id);
    setEditingData(JSON.parse(JSON.stringify(expectation)));
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingData(null);
  };

  const handleValueChange = (month: number, field: 'value' | 'note', value: string) => {
    if (!editingData) return;
    
    const monthKey = `month_${month}` as keyof RampingExpectation;
    const currentMonthValue = editingData[monthKey] as MonthValue;
    const updatedMonthValue: MonthValue = {
      ...currentMonthValue,
      [field]: value,
    };

    setEditingData({
      ...editingData,
      [monthKey]: updatedMonthValue,
    });
  };

  const saveChanges = async () => {
    if (!editingData) return;

    try {
      const monthDataToSave = {
        month_1: { value: editingData.month_1.value, note: editingData.month_1.note } as unknown as Json,
        month_2: { value: editingData.month_2.value, note: editingData.month_2.note } as unknown as Json,
        month_3: { value: editingData.month_3.value, note: editingData.month_3.note } as unknown as Json,
        month_4: { value: editingData.month_4.value, note: editingData.month_4.note } as unknown as Json,
        month_5: { value: editingData.month_5.value, note: editingData.month_5.note } as unknown as Json,
        month_6: { value: editingData.month_6.value, note: editingData.month_6.note } as unknown as Json,
      };

      const { error } = await supabase
        .from("ramping_expectations")
        .update(monthDataToSave)
        .eq("id", editingData.id);

      if (error) throw error;

      setRampingData(rampingData.map(item => 
        item.id === editingData.id ? editingData : item
      ));
      
      toast({
        title: "Success",
        description: "Changes saved successfully",
      });
      
      cancelEditing();
    } catch (error) {
      console.error('Error saving changes:', error);
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="w-full text-center py-4">Loading ramping expectations...</div>;
  }

  if (!rampingData || rampingData.length === 0) {
    return <div className="w-full text-center py-4">No ramping expectations available</div>;
  }

  return (
    <div className="w-full">
      <div className="text-2xl font-semibold text-center mb-6">
        Expectations during the Ramping Period
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] bg-gray-700 text-white">
              &nbsp;
            </TableHead>
            {[1, 2, 3, 4, 5, 6].map((month) => (
              <TableHead
                key={month}
                className="text-center bg-gradient-to-r from-gray-100 to-gray-300"
              >
                Month {month}
              </TableHead>
            ))}
            {isAdminRoute && <TableHead className="w-[100px]">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rampingData.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium bg-gray-700 text-white">
                {row.metric}
              </TableCell>
              {[1, 2, 3, 4, 5, 6].map((month) => {
                const monthKey = `month_${month}` as keyof RampingExpectation;
                const monthData = editingId === row.id && editingData 
                  ? editingData[monthKey] as MonthValue
                  : row[monthKey] as MonthValue;

                return (
                  <TableCell key={month} className="text-center p-2">
                    {editingId === row.id && isAdminRoute ? (
                      <div className="space-y-2">
                        <Input
                          value={monthData.value}
                          onChange={(e) => handleValueChange(month, 'value', e.target.value)}
                          className="w-full text-center"
                        />
                        <Input
                          value={monthData.note}
                          onChange={(e) => handleValueChange(month, 'note', e.target.value)}
                          className="w-full text-center text-sm text-gray-500"
                          placeholder="Add note"
                        />
                      </div>
                    ) : (
                      <>
                        <div className="font-medium">{monthData.value}</div>
                        {monthData.note && (
                          <div className="text-sm text-gray-500 mt-1">
                            {monthData.note}
                          </div>
                        )}
                      </>
                    )}
                  </TableCell>
                );
              })}
              {isAdminRoute && (
                <TableCell>
                  {editingId === row.id ? (
                    <div className="flex gap-2">
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
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEditing(row)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
