import { useAuth } from '@/lib/context/auth-context';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    async function getUserRole() {
      if (!user) return;

      try {
        const { data: roleData, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching user role:', error);
          toast({
            title: "Error",
            description: "Failed to verify user access",
            variant: "destructive",
          });
          return;
        }

        setUserRole(roleData?.role || null);
      } catch (error) {
        console.error('Error in getUserRole:', error);
      } finally {
        setRoleLoading(false);
      }
    }

    if (user) {
      getUserRole();
    } else {
      setRoleLoading(false);
    }
  }, [user, toast]);

  if (loading || roleLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    toast({
      title: "Access Denied",
      description: "You don't have permission to access this page",
      variant: "destructive",
    });
    
    // Redirect based on user role
    switch (userRole) {
      case 'director':
        return <Navigate to="/director/dashboard" replace />;
      case 'manager':
        return <Navigate to="/manager/dashboard" replace />;
      case 'sales_rep':
        return <Navigate to="/sales-rep/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}