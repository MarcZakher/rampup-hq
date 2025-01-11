import { useState, useEffect } from "react";
import { AppLayout } from "@/components/Layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type MeetingType = Database["public"]["Enums"]["meeting_type"];

export default function MeetingDefinitions() {
  const [meetingType, setMeetingType] = useState<MeetingType | "">("");
  const [definition, setDefinition] = useState("");
  const [idealScenario, setIdealScenario] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [definitions, setDefinitions] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchDefinitions();
  }, []);

  const fetchDefinitions = async () => {
    const { data, error } = await supabase
      .from("meeting_definitions")
      .select("*");
    
    if (!error && data) {
      setDefinitions(data);
    }
  };

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
      const { error } = await supabase.from("meeting_definitions").upsert({
        meeting_type: meetingType as MeetingType,
        definition: definition,
        ideal_scenario: idealScenario,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Meeting definition saved successfully",
      });
      fetchDefinitions();
      setMeetingType("");
      setDefinition("");
      setIdealScenario("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save meeting definition",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Meeting Definitions</h1>
        
        <Card className="p-6 mb-6">
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
              {isSubmitting ? "Saving..." : "Save Definition"}
            </Button>
          </form>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Existing Definitions</h2>
          {definitions.map((def) => (
            <Card key={def.id} className="p-4">
              <h3 className="font-semibold mb-2 capitalize">{def.meeting_type} Meeting</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Definition:</strong> {def.definition}</p>
                <p><strong>Ideal Scenario:</strong> {def.ideal_scenario}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}