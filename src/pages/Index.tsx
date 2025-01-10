import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { UserCog } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-primary">RampUp</h1>
        <div className="space-x-4">
          <Button 
            onClick={() => navigate("/director/dashboard")}
            className="w-48"
          >
            Director View
          </Button>
          <Button 
            onClick={() => navigate("/manager/dashboard")}
            className="w-48"
          >
            Manager View
          </Button>
          <Button 
            onClick={() => navigate("/admin/dashboard")}
            className="w-48"
            variant="secondary"
          >
            <UserCog />
            Admin View
          </Button>
        </div>
      </div>
    </div>
  );
}