import { AppSidebar } from "./AppSidebar";
import { SalesRepSidebar } from "./SalesRepSidebar";
import { TopNav } from "./TopNav";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useLocation } from "react-router-dom";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function CustomAppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const isSalesRepRoute = location.pathname.startsWith('/sales-rep');

  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen w-full">
        {isSalesRepRoute ? <SalesRepSidebar /> : <AppSidebar />}
        <main className="flex-1">
          <TopNav />
          <div className="h-[calc(100vh-4rem)]">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}