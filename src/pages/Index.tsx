import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { UserCog, BarChart3, Users2, User, MessageSquare } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rampup-primary via-rampup-secondary to-rampup-tertiary">
      <div className="max-w-5xl w-full px-6">
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-rampup-light">
            RampUP
          </h1>
          <p className="text-lg text-white/90 max-w-xl mx-auto">
            Streamline your onboarding process and empower your team with our comprehensive management platform
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
          <Button 
            onClick={() => navigate("/director/dashboard")}
            className="min-h-[160px] w-full py-6 px-4 flex flex-col items-center gap-3 hover:scale-105 transition-transform bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20"
            variant="ghost"
          >
            <BarChart3 className="h-8 w-8 text-white" />
            <div className="space-y-2">
              <div className="font-semibold text-base text-white">Director View</div>
              <div className="text-xs text-white/80 leading-relaxed">Strategic oversight & planning</div>
            </div>
          </Button>
          
          <Button 
            onClick={() => navigate("/manager/dashboard")}
            className="min-h-[160px] w-full py-6 px-4 flex flex-col items-center gap-3 hover:scale-105 transition-transform bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20"
            variant="ghost"
          >
            <Users2 className="h-8 w-8 text-white" />
            <div className="space-y-2">
              <div className="font-semibold text-base text-white">Manager View</div>
              <div className="text-xs text-white/80 leading-relaxed">Team management & tracking</div>
            </div>
          </Button>

          <Button 
            onClick={() => navigate("/sales-rep/dashboard")}
            className="min-h-[160px] w-full py-6 px-4 flex flex-col items-center gap-3 hover:scale-105 transition-transform bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20"
            variant="ghost"
          >
            <User className="h-8 w-8 text-white" />
            <div className="space-y-2">
              <div className="font-semibold text-base text-white">Ramping Sales Rep View</div>
              <div className="text-xs text-white/80 leading-relaxed">Personal progress & tasks</div>
            </div>
          </Button>

          <Button 
            onClick={() => navigate("/coaching/dashboard")}
            className="min-h-[160px] w-full py-6 px-4 flex flex-col items-center gap-3 hover:scale-105 transition-transform bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20"
            variant="ghost"
          >
            <MessageSquare className="h-8 w-8 text-white" />
            <div className="space-y-2">
              <div className="font-semibold text-base text-white">Coaching View</div>
              <div className="text-xs text-white/80 leading-relaxed">AI-powered meeting feedback</div>
            </div>
          </Button>
          
          <Button 
            onClick={() => navigate("/admin/dashboard")}
            className="min-h-[160px] w-full py-6 px-4 flex flex-col items-center gap-3 hover:scale-105 transition-transform bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20"
            variant="ghost"
          >
            <UserCog className="h-8 w-8 text-white" />
            <div className="space-y-2">
              <div className="font-semibold text-base text-white">Admin View</div>
              <div className="text-xs text-white/80 leading-relaxed">System configuration & control</div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}