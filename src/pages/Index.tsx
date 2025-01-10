import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-primary">RampUp</h1>
        <div className="space-y-4">
          <Button 
            onClick={() => navigate("/manager/dashboard")}
            className="w-48"
          >
            Manager View
          </Button>
        </div>
      </div>
    </div>
  );
}