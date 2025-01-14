import { useNavigate } from 'react-router-dom';
import { BarChart3, ClipboardList, GraduationCap, LayoutDashboard, MessageSquare } from 'lucide-react';
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
import { useUserRole } from '@/hooks/use-user-role';

export function AppSidebar() {
  const navigate = useNavigate();
  const { role } = useUserRole();

  const getMenuItems = () => {
    switch (role) {
      case 'director':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', onClick: () => navigate('/director/dashboard') },
          { icon: BarChart3, label: 'Analytics', onClick: () => navigate('/director/analytics') },
        ];
      case 'manager':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', onClick: () => navigate('/manager/dashboard') },
          { icon: MessageSquare, label: 'Feedback to Reps', onClick: () => navigate('/manager/feedback') },
        ];
      case 'sales_rep':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', onClick: () => navigate('/sales-rep/dashboard') },
          { icon: GraduationCap, label: 'Training Journey', onClick: () => navigate('/sales-rep/training') },
          { icon: BarChart3, label: 'Analytics', onClick: () => navigate('/sales-rep/analytics') },
        ];
      default:
        // This will handle both undefined roles and coaching roles
        return [
          { icon: ClipboardList, label: 'Coaching', onClick: () => navigate('/coaching/dashboard') },
        ];
    }
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {getMenuItems().map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton onClick={item.onClick}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
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