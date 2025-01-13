import { Home, Users, LineChart, ClipboardList, Settings, BookOpen, Target } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const menuItems = [
  { title: 'Home', icon: Home, url: '/' },
  { title: 'Sales Reps', icon: Users, url: '/sales-reps' },
  { title: 'Assessments', icon: ClipboardList, url: '/assessments' },
  { title: 'Performance Analytics', icon: LineChart, url: '/director/analytics' },
  { title: 'Ramping Expectations', icon: Target, url: '/admin/ramping-expectations' },
  { title: 'Training Journey', icon: BookOpen, url: '/admin/training-journey' },
  { title: 'Settings', icon: Settings, url: '/settings' },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary">RampUP</h1>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}