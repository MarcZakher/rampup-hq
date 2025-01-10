import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { UserCog, BarChart3, Users2, User } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl w-full px-6">
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
            RampUP
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Streamline your onboarding process and empower your team with our comprehensive management platform
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <Button 
            onClick={() => navigate("/director/dashboard")}
            className="min-h-[160px] w-full py-6 px-4 flex flex-col items-center gap-3 hover:scale-105 transition-transform"
            variant="default"
          >
            <BarChart3 className="h-8 w-8" />
            <div className="space-y-2">
              <div className="font-semibold text-base">Director View</div>
              <div className="text-xs text-primary-foreground/80 leading-relaxed">Strategic oversight & planning</div>
            </div>
          </Button>
          
          <Button 
            onClick={() => navigate("/manager/dashboard")}
            className="min-h-[160px] w-full py-6 px-4 flex flex-col items-center gap-3 hover:scale-105 transition-transform"
            variant="default"
          >
            <Users2 className="h-8 w-8" />
            <div className="space-y-2">
              <div className="font-semibold text-base">Manager View</div>
              <div className="text-xs text-primary-foreground/80 leading-relaxed">Team management & tracking</div>
            </div>
          </Button>

          <Button 
            onClick={() => navigate("/sales-rep/dashboard")}
            className="min-h-[160px] w-full py-6 px-4 flex flex-col items-center gap-3 hover:scale-105 transition-transform"
            variant="default"
          >
            <User className="h-8 w-8" />
            <div className="space-y-2">
              <div className="font-semibold text-base">Sales Rep View</div>
              <div className="text-xs text-primary-foreground/80 leading-relaxed">Personal progress & tasks</div>
            </div>
          </Button>
          
          <Button 
            onClick={() => navigate("/admin/dashboard")}
            className="min-h-[160px] w-full py-6 px-4 flex flex-col items-center gap-3 hover:scale-105 transition-transform"
            variant="secondary"
          >
            <UserCog className="h-8 w-8" />
            <div className="space-y-2">
              <div className="font-semibold text-base">Admin View</div>
              <div className="text-xs text-secondary-foreground/80 leading-relaxed">System configuration & control</div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}