import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RampingExpectation {
  id: string;
  metric: string;
  month_1: string;
  month_2: string;
  month_3: string;
  month_4: string;
  month_5: string;
  month_6: string;
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
      setExpectations(data);
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
    newValue: string
  ) => {
    setExpectations((prev) =>
      prev.map((exp) => {
        if (exp.id === expectationId) {
          const monthKey = `month_${month}` as keyof RampingExpectation;
          return {
            ...exp,
            [monthKey]: newValue,
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
              return (
                <div key={i} className="space-y-2">
                  <Label>Month {i + 1}</Label>
                  <Input
                    type="number"
                    value={expectation[monthKey]}
                    onChange={(e) =>
                      handleValueChange(
                        expectation.id,
                        i + 1,
                        e.target.value
                      )
                    }
                    className="mb-2"
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