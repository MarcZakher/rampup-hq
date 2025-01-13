import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';

interface AssessmentScoreInputProps {
  score: number;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * Input component for assessment scores with validation
 */
export function AssessmentScoreInput({ score, onChange, className }: AssessmentScoreInputProps) {
  const { toast } = useToast();

  const handleChange = (value: string) => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue) || numericValue < 0 || numericValue > 5) {
      toast({
        title: "Error",
        description: "Please enter a valid score between 0 and 5",
        variant: "destructive"
      });
      return;
    }
    onChange(value);
  };

  return (
    <Input
      type="number"
      min="0"
      max="5"
      step="0.5"
      value={score || ''}
      onChange={(e) => handleChange(e.target.value)}
      className={`w-16 text-center ${className}`}
    />
  );
}