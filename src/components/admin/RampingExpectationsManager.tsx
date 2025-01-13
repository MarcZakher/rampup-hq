import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

export function RampingExpectationsManager() {
  const [expectations, setExpectations] = useState<RampingExpectation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchExpectations();
  }, []);

  const fetchExpectations = async () => {
    try {
      const { data, error } = await supabase
        .from("ramping_expectations")
        .select("*")
        .order("metric");

      if (error) throw error;

      // Parse the JSON data into the correct type
      const parsedData: RampingExpectation[] = data.map(item => ({
        id: item.id,
        metric: item.metric,
        month_1: typeof item.month_1 === 'string' ? JSON.parse(item.month_1) : item.month_1,
        month_2: typeof item.month_2 === 'string' ? JSON.parse(item.month_2) : item.month_2,
        month_3: typeof item.month_3 === 'string' ? JSON.parse(item.month_3) : item.month_3,
        month_4: typeof item.month_4 === 'string' ? JSON.parse(item.month_4) : item.month_4,
        month_5: typeof item.month_5 === 'string' ? JSON.parse(item.month_5) : item.month_5,
        month_6: typeof item.month_6 === 'string' ? JSON.parse(item.month_6) : item.month_6,
      }));

      setExpectations(parsedData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch ramping expectations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleValueChange = (
    expectationId: string,
    month: number,
    field: "value" | "note",
    newValue: string
  ) => {
    setExpectations((prev) =>
      prev.map((exp) => {
        if (exp.id === expectationId) {
          const monthKey = `month_${month}` as keyof RampingExpectation;
          const currentMonth = exp[monthKey] as MonthValue;
          return {
            ...exp,
            [monthKey]: {
              ...currentMonth,
              [field]: newValue,
            },
          };
        }
        return exp;
      })
    );
  };

  const handleSave = async (expectation: RampingExpectation) => {
    try {
      const { error } = await supabase
        .from("ramping_expectations")
        .update({
          month_1: expectation.month_1,
          month_2: expectation.month_2,
          month_3: expectation.month_3,
          month_4: expectation.month_4,
          month_5: expectation.month_5,
          month_6: expectation.month_6,
        })
        .eq("id", expectation.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Ramping expectations updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update ramping expectations",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Manage Ramping Period Expectations</h2>
      {expectations.map((expectation) => (
        <Card key={expectation.id} className="p-6">
          <h3 className="text-xl font-semibold mb-4">{expectation.metric}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }, (_, i) => {
              const monthKey = `month_${i + 1}` as keyof RampingExpectation;
              const monthValue = expectation[monthKey] as MonthValue;
              return (
                <div key={i} className="space-y-2">
                  <Label>Month {i + 1}</Label>
                  <Input
                    value={monthValue.value}
                    onChange={(e) =>
                      handleValueChange(
                        expectation.id,
                        i + 1,
                        "value",
                        e.target.value
                      )
                    }
                    className="mb-2"
                  />
                  <Input
                    value={monthValue.note}
                    onChange={(e) =>
                      handleValueChange(
                        expectation.id,
                        i + 1,
                        "note",
                        e.target.value
                      )
                    }
                    placeholder="Note (optional)"
                  />
                </div>
              );
            })}
          </div>
          <Button onClick={() => handleSave(expectation)} className="mt-4">
            Save Changes
          </Button>
        </Card>
      ))}
    </div>
  );
}