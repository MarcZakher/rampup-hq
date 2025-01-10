import { AppSidebar } from "./AppSidebar";
import { TopNav } from "./TopNav";
import { SidebarProvider } from "@/components/ui/sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function CustomAppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1">
          <TopNav />
          <div className="h-[calc(100vh-4rem)]">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}