import { AppLayout } from "@/components/Layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Settings, List } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="p-6 hover:border-rampup-light/40 transition-colors cursor-pointer"
                onClick={() => navigate("/admin/meeting-definitions")}>
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-rampup-primary/10 rounded-lg">
                <Settings className="h-6 w-6 text-rampup-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Meeting Definitions</h3>
                <p className="text-sm text-gray-500">Manage meeting types and their definitions</p>
              </div>
            </div>
          </Card>

          {/* Additional admin features can be added here as more cards */}
        </div>
      </div>
    </AppLayout>
  );
}