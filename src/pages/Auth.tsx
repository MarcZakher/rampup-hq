import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AuthForm } from '@/components/auth/AuthForm';
import { getErrorMessage } from '@/utils/auth';

const Auth = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Session check error:', error);
          await supabase.auth.signOut();
          return;
        }
        if (session) {
          redirectBasedOnRole();
        }
      } catch (error) {
        console.error('Session check failed:', error);
        setErrorMessage('Failed to check authentication status');
      }
    };

    const redirectBasedOnRole = async () => {
      try {
        // Get user role from user_roles table
        const { data: userRoles, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .single();

        if (roleError) {
          console.error('Role check error:', roleError);
          setErrorMessage('Failed to check user role');
          return;
        }

        // Redirect based on role
        switch (userRoles?.role) {
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
            console.error('Unknown role:', userRoles?.role);
            setErrorMessage('Invalid user role');
            await supabase.auth.signOut();
        }
      } catch (error) {
        console.error('Role redirect failed:', error);
        setErrorMessage('Failed to process user role');
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session);
      
      if (event === 'SIGNED_IN') {
        if (session) {
          redirectBasedOnRole();
        }
      }
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      }
      if (event === 'USER_UPDATED') {
        const { error } = await supabase.auth.getSession();
        if (error) {
          setErrorMessage(getErrorMessage(error));
        }
      }
      if (event === 'SIGNED_OUT') {
        localStorage.removeItem('supabase.auth.token');
        navigate('/auth');
        setErrorMessage("");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rampup-light via-white to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-rampup-primary/20">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 bg-gradient-to-r from-rampup-primary to-rampup-secondary bg-clip-text text-transparent">
            Welcome to RampUP
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access your dashboard
          </p>
        </div>
        {errorMessage && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        <AuthForm />
      </div>
    </div>
  );
};

export default Auth;