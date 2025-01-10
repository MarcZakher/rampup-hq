import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/context/auth-context";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react"; // Added this import

const initialProgressData = [
  {
    metric: "DMs",
    values: Array(6).fill(""),
  },
  {
    metric: "NBMs",
    values: Array(6).fill(""),
  },
  {
    metric: "Scope+",
    values: Array(6).fill(""),
  },
  {
    metric: "NL",
    values: Array(6).fill(""),
  },
];

export function ProgressTrackingTable() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [progressData, setProgressData] = useState(initialProgressData);

  const { data: scores, isLoading } = useQuery({
    queryKey: ['assessment-scores', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('assessment_scores')
        .select('*')
        .eq('sales_rep_id', user.id);

      if (error) {
        console.error('Error fetching scores:', error);
        toast({
          title: "Error",
          description: "Failed to load your progress data",
          variant: "destructive",
        });
        return null;
      }

      return data;
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (scores) {
      // Update progress data with scores from database
      const newProgressData = [...initialProgressData];
      scores.forEach((score) => {
        const monthIndex = parseInt(score.month.replace('month', '')) - 1;
        if (monthIndex >= 0 && monthIndex < 6) {
          newProgressData[score.assessment_index].values[monthIndex] = score.score?.toString() || '';
        }
      });
      setProgressData(newProgressData);
    }
  }, [scores]);

  const handleInputChange = async (metricIndex: number, monthIndex: number, value: string) => {
    if (!user?.id) return;

    const newData = [...progressData];
    newData[metricIndex] = {
      ...newData[metricIndex],
      values: newData[metricIndex].values.map((v, i) => (i === monthIndex ? value : v)),
    };
    setProgressData(newData);

    // Update score in database
    const { error } = await supabase
      .from('assessment_scores')
      .upsert({
        sales_rep_id: user.id,
        month: `month${monthIndex + 1}`,
        assessment_index: metricIndex,
        score: value ? parseFloat(value) : null,
      });

    if (error) {
      console.error('Error updating score:', error);
      toast({
        title: "Error",
        description: "Failed to save your progress",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full mt-12">
      <div className="text-2xl font-semibold text-center mb-6">Track Your Progress</div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] bg-primary text-primary-foreground">
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {progressData.map((row, rowIndex) => (
            <TableRow key={row.metric}>
              <TableCell className="font-medium bg-primary text-primary-foreground">
                {row.metric}
              </TableCell>
              {row.values.map((value, columnIndex) => (
                <TableCell key={columnIndex} className="p-2">
                  <Input
                    type="number"
                    value={value}
                    onChange={(e) => handleInputChange(rowIndex, columnIndex, e.target.value)}
                    className="text-center h-8"
                    min="0"
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}