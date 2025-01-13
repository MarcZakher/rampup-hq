import { useEffect, useState } from 'react';
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { AuthError, AuthApiError } from '@supabase/supabase-js';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Auth = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/director/dashboard');
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        navigate('/director/dashboard');
      }
      if (event === 'USER_UPDATED') {
        const handleError = async () => {
          const { error } = await supabase.auth.getSession();
          if (error) {
            setErrorMessage(getErrorMessage(error));
          }
        };
        handleError();
      }
      if (event === 'SIGNED_OUT') {
        navigate('/');
        setErrorMessage(""); // Clear errors on sign out
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const getErrorMessage = (error: AuthError) => {
    if (error instanceof AuthApiError) {
      switch (error.code) {
        case 'invalid_credentials':
          return 'Invalid email or password. Please check your credentials and try again.';
        case 'email_not_confirmed':
          return 'Please verify your email address before signing in.';
        case 'user_not_found':
          return 'No user found with these credentials.';
        case 'invalid_grant':
          return 'Invalid login credentials.';
        default:
          return error.message;
      }
    }
    return error.message;
  };

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
        <div className="mt-8">
          <SupabaseAuth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#9b87f5',
                    brandAccent: '#7E69AB',
                    brandButtonText: 'white',
                    defaultButtonBackground: '#F8F9FA',
                    defaultButtonBackgroundHover: '#E9ECEF',
                    inputBackground: 'white',
                    inputBorder: '#E9ECEF',
                    inputBorderHover: '#9b87f5',
                    inputBorderFocus: '#7E69AB',
                  },
                  borderWidths: {
                    buttonBorderWidth: '1px',
                    inputBorderWidth: '1px',
                  },
                  radii: {
                    borderRadiusButton: '0.5rem',
                    buttonBorderRadius: '0.5rem',
                    inputBorderRadius: '0.5rem',
                  },
                },
              },
              style: {
                button: {
                  border: '1px solid transparent',
                  borderRadius: '0.5rem',
                  padding: '0.625rem 1.25rem',
                  transition: 'all 0.2s ease-in-out',
                },
                anchor: {
                  color: '#7E69AB',
                  textDecoration: 'none',
                  fontWeight: '500',
                  hover: {
                    color: '#9b87f5',
                  },
                },
                container: {
                  borderRadius: '0.75rem',
                },
                input: {
                  borderRadius: '0.5rem',
                },
              },
            }}
            providers={[]}
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;