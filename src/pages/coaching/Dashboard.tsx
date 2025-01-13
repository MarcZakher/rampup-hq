import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CustomAppLayout } from "@/components/Layout/CustomAppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { ScrollArea } from "@/components/ui/scroll-area";

type MeetingType = Database["public"]["Enums"]["meeting_type"];

export default function CoachingDashboard() {
  const navigate = useNavigate();
  const [meetingType, setMeetingType] = useState<MeetingType | "">("");
  const [transcript, setTranscript] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiFeedback, setAiFeedback] = useState("");
  const { toast } = useToast();

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to access the coaching dashboard",
          variant: "destructive",
        });
        navigate("/");
      }
    };

    checkAuth();
  }, [navigate, toast]);

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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error("No authenticated user");
      }

      // Get AI feedback
      const { data: aiData, error: aiError } = await supabase.functions.invoke("analyze-meeting", {
        body: { transcript, meetingType },
      });

      if (aiError) throw aiError;
      
      if (!aiData?.analysis) {
        throw new Error("No analysis received from AI");
      }

      setAiFeedback(aiData.analysis);

      // Save to database
      const { error: dbError } = await supabase.from("meeting_analyses").insert({
        meeting_type: meetingType as MeetingType,
        transcript: transcript,
        sales_rep_id: session.user.id,
        ai_feedback: aiData.analysis
      });

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Meeting transcript analyzed and saved",
      });
    } catch (error) {
      console.error("Error analyzing meeting:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze transcript",
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
        
        <div className="grid gap-6 md:grid-cols-2">
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
                {isSubmitting ? "Analyzing..." : "Submit for Analysis"}
              </Button>
            </form>
          </Card>

          {aiFeedback && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">AI Feedback</h2>
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                <div className="whitespace-pre-wrap">{aiFeedback}</div>
              </ScrollArea>
            </Card>
          )}
        </div>
      </div>
    </CustomAppLayout>
  );
}