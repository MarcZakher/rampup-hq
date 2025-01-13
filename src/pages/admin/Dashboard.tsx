import { CustomAppLayout } from "@/components/Layout/CustomAppLayout";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <CustomAppLayout>
      <div className="container mx-auto py-8 space-y-12">
        <div>
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
          
          <Menubar className="mb-6">
            <MenubarMenu>
              <MenubarTrigger>Navigation</MenubarTrigger>
              <MenubarContent>
                <MenubarItem onClick={() => navigate("/admin/ramping-expectations")}>
                  Ramping Expectations
                </MenubarItem>
                <MenubarItem onClick={() => navigate("/admin/training-journey")}>
                  Training Journey
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>

          <div className="bg-white rounded-lg shadow-md p-6">
            <p>Welcome to the Admin Dashboard</p>
            <p>Use the navigation menu to access different sections:</p>
            <ul className="list-disc list-inside mt-4 space-y-2">
              <li>Ramping Expectations - Manage expectations during the ramping period</li>
              <li>Training Journey - Edit and manage training modules</li>
            </ul>
          </div>
        </div>
      </div>
    </CustomAppLayout>
  );
}