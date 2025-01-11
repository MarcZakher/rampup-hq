import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type MeetingType = Database["public"]["Enums"]["meeting_type"];

interface MeetingDefinitionFormProps {
  onSuccess: () => void;
  initialData?: {
    id: string;
    meeting_type: MeetingType;
    definition: string;
    ideal_scenario: string;
  };
}

export function MeetingDefinitionForm({ onSuccess, initialData }: MeetingDefinitionFormProps) {
  const [meetingType, setMeetingType] = useState<MeetingType | "">(initialData?.meeting_type || "");
  const [definition, setDefinition] = useState(initialData?.definition || "");
  const [idealScenario, setIdealScenario] = useState(initialData?.ideal_scenario || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!meetingType || !definition || !idealScenario) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from("meeting_definitions")
        .upsert(
          {
            ...(initialData?.id ? { id: initialData.id } : {}),
            meeting_type: meetingType,
            definition,
            ideal_scenario: idealScenario,
          },
          { onConflict: "id" }
        );

      if (error) {
        console.error("Error saving meeting definition:", error);
        throw error;
      }

      toast({
        title: "Success",
        description: `Meeting definition ${initialData ? "updated" : "saved"} successfully`,
      });
      
      onSuccess();
      
      if (!initialData) {
        setMeetingType("");
        setDefinition("");
        setIdealScenario("");
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      toast({
        title: "Error",
        description: "Failed to save meeting definition. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="meetingType">Meeting Type</Label>
          <Select
            value={meetingType}
            onValueChange={(value: MeetingType) => setMeetingType(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select meeting type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="discovery">Discovery Meeting</SelectItem>
              <SelectItem value="new_business">New Business Meeting</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="definition">Meeting Definition</Label>
          <Textarea
            id="definition"
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
            placeholder="Describe what this type of meeting entails..."
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="idealScenario">Ideal Scenario</Label>
          <Textarea
            id="idealScenario"
            value={idealScenario}
            onChange={(e) => setIdealScenario(e.target.value)}
            placeholder="Describe what a perfect execution of this meeting looks like..."
            className="min-h-[100px]"
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initialData ? "Update Definition" : "Save Definition"}
        </Button>
      </form>
    </Card>
  );
}