import { NavLink } from "react-router-dom";
import { BookOpen, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

export function SalesRepSidebar() {
  const isAdmin = true; // This should be determined by user role

  return (
    <div className="pb-12 w-64">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
                  isActive ? "bg-gray-100 text-gray-900" : ""
                )
              }
            >
              Dashboard
            </NavLink>
            {isAdmin && (
              <>
                <NavLink
                  to="/admin/ramping-expectations"
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
                      isActive ? "bg-gray-100 text-gray-900" : ""
                    )
                  }
                >
                  <ClipboardList className="h-4 w-4" />
                  Ramping Expectations
                </NavLink>
                <NavLink
                  to="/admin/training-journey"
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
                      isActive ? "bg-gray-100 text-gray-900" : ""
                    )
                  }
                >
                  <BookOpen className="h-4 w-4" />
                  Edit Training Journey
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}