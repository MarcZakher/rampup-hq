import { AppSidebar } from "./AppSidebar";
import { TopNav } from "./TopNav";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function CustomAppLayout({ children }: AppLayoutProps) {
  return (
    <div className="relative flex min-h-screen">
      <AppSidebar />
      <main className="flex-1">
        <TopNav />
        <div className="h-[calc(100vh-4rem)]">{children}</div>
      </main>
    </div>
  );
}