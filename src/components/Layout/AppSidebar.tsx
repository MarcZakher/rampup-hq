import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { FileText, LayoutDashboard } from "lucide-react";

export function AppSidebar() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
      <div className="flex flex-col h-full">
        <div className="flex-1 py-6 space-y-1">
          <Link
            to="/manager/dashboard"
            className={cn(
              "flex items-center px-6 py-3 text-sm font-medium transition-colors",
              isActive("/manager/dashboard")
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
          <Link
            to="/manager/assessments"
            className={cn(
              "flex items-center px-6 py-3 text-sm font-medium transition-colors",
              isActive("/manager/assessments")
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <FileText className="w-5 h-5 mr-3" />
            Assessments
          </Link>
        </div>
      </div>
    </div>
  );
}