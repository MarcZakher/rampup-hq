import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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

interface MetricRow {
  name: string;
  values: string[];
}

interface DatabaseRampingExpectation {
  id: string;
  metric: string;
  month_1: Json;
  month_2: Json;
  month_3: Json;
  month_4: Json;
  month_5: Json;
  month_6: Json;
  created_at: string;
  updated_at: string;
}

export function RampingExpectationsTable() {
  const [metrics, setMetrics] = useState<MetricRow[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchRampingExpectations();
  }, []);

  const parseMonthValue = (value: Json): MonthValue => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (e) {
        return { value: '', note: '' };
      }
    }
    if (typeof value === 'object' && value !== null && 'value' in value && 'note' in value) {
      const typedValue = value as { value: string; note: string };
      return {
        value: String(typedValue.value),
        note: String(typedValue.note)
      };
    }
    return { value: '', note: '' };
  };

  const fetchRampingExpectations = async () => {
    try {
      const { data, error } = await supabase
        .from("ramping_expectations")
        .select("*");

      if (error) throw error;

      if (data && data.length > 0) {
        const formattedMetrics = data.map((row: DatabaseRampingExpectation) => ({
          name: row.metric,
          values: [
            parseMonthValue(row.month_1).value,
            parseMonthValue(row.month_2).value,
            parseMonthValue(row.month_3).value,
            parseMonthValue(row.month_4).value,
            parseMonthValue(row.month_5).value,
            parseMonthValue(row.month_6).value,
          ]
        }));
        setMetrics(formattedMetrics);
      }
    } catch (error) {
      console.error("Error fetching ramping expectations:", error);
      toast({
        title: "Error",
        description: "Failed to load ramping expectations",
        variant: "destructive",
      });
    }
  };

  const handleValueChange = (metricIndex: number, monthIndex: number, value: string) => {
    const newMetrics = [...metrics];
    newMetrics[metricIndex].values[monthIndex] = value;
    setMetrics(newMetrics);
  };

  const handleSave = async () => {
    try {
      // Convert metrics to the format expected by the database
      const updates = metrics.map(metric => ({
        metric: metric.name,
        month_1: { value: metric.values[0], note: "" },
        month_2: { value: metric.values[1], note: "" },
        month_3: { value: metric.values[2], note: "" },
        month_4: { value: metric.values[3], note: "" },
        month_5: { value: metric.values[4], note: "" },
        month_6: { value: metric.values[5], note: "" },
      }));

      // Update each metric in the database
      for (const update of updates) {
        const { error } = await supabase
          .from("ramping_expectations")
          .update(update)
          .eq("metric", update.metric);

        if (error) throw error;
      }

      setIsEditing(false);
      toast({
        title: "Success",
        description: "Ramping expectations updated successfully",
      });
    } catch (error) {
      console.error("Error updating ramping expectations:", error);
      toast({
        title: "Error",
        description: "Failed to update ramping expectations",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 mb-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Ramping Expectations</h2>
        <div className="space-x-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </>
          )}
        </div>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="bg-gray-100 w-32">Metrics</TableHead>
              {[1, 2, 3, 4, 5, 6].map((month) => (
                <TableHead key={month} className="bg-gray-100 text-center">
                  Month {month}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {metrics.map((metric, metricIndex) => (
              <TableRow key={metric.name}>
                <TableCell className="font-medium bg-gray-800 text-white">
                  {metric.name}
                </TableCell>
                {metric.values.map((value, monthIndex) => (
                  <TableCell key={monthIndex} className="text-center">
                    {isEditing ? (
                      <Input
                        type="text"
                        value={value}
                        onChange={(e) =>
                          handleValueChange(metricIndex, monthIndex, e.target.value)
                        }
                        className="w-20 mx-auto text-center"
                      />
                    ) : (
                      value
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}