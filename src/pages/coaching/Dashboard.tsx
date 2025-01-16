import { useState } from "react";
import { CustomAppLayout } from "@/components/Layout/CustomAppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { getCurrentUserCompanyId } from "@/utils/auth";

type MeetingType = Database["public"]["Enums"]["meeting_type"];

export default function CoachingDashboard() {
  const [meetingType, setMeetingType] = useState<MeetingType | "">("");
  const [transcript, setTranscript] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingType || !transcript) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      const company_id = await getCurrentUserCompanyId();

      const { error } = await supabase.from("meeting_analyses").insert({
        meeting_type: meetingType as MeetingType,
        transcript: transcript,
        sales_rep_id: user.id,
        company_id
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Meeting transcript submitted for analysis",
      });
      setTranscript("");
      setMeetingType("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit transcript",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomAppLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Meeting Analysis Dashboard</h1>
        
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
              <Label htmlFor="transcript">Meeting Transcript</Label>
              <Textarea
                id="transcript"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Paste your meeting transcript here..."
                className="min-h-[200px]"
              />
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit for Analysis"}
            </Button>
          </form>
        </Card>
      </div>
    </CustomAppLayout>
  );
}