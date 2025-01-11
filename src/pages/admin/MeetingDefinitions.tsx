import { useState, useEffect } from "react";
import { AppLayout } from "@/components/Layout/AppLayout";
import { MeetingDefinitionForm } from "@/components/admin/MeetingDefinitionForm";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export default function MeetingDefinitions() {
  const [definitions, setDefinitions] = useState<any[]>([]);

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

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Meeting Definitions</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Add New Definition</h2>
            <MeetingDefinitionForm onSuccess={fetchDefinitions} />
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Existing Definitions</h2>
            <div className="space-y-4">
              {definitions.map((def) => (
                <Card key={def.id} className="p-6">
                  <h3 className="font-semibold mb-2 capitalize">{def.meeting_type.replace('_', ' ')} Meeting</h3>
                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-700">Definition:</p>
                      <p className="mt-1">{def.definition}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Ideal Scenario:</p>
                      <p className="mt-1">{def.ideal_scenario}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <MeetingDefinitionForm 
                      initialData={def}
                      onSuccess={fetchDefinitions}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}