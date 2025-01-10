import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export function useAuthRedirect() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRedirect = async (userId: string) => {
    try {
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (roleError) {
        console.error('Error fetching user role:', roleError);
        throw roleError;
      }

      if (!roleData?.role) {
        console.error('No role found for user');
        navigate('/');
        return;
      }

      switch (roleData.role) {
        case 'director':
          navigate('/director/dashboard');
          break;
        case 'manager':
          navigate('/manager/dashboard');
          break;
        case 'sales_rep':
          navigate('/sales-rep/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (error: any) {
      console.error('Error in handleRedirect:', error);
      toast({
        title: 'Error',
        description: 'Failed to verify user role. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return { handleRedirect };
}