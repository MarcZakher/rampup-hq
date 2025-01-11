import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';

export default function Login() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Get the user's role from metadata
        const { data: { user } } = await supabase.auth.getUser();
        const userRole = user?.user_metadata?.role;

        // Redirect based on role
        if (userRole === 'director') {
          navigate('/director/dashboard');
        } else if (userRole === 'manager') {
          navigate('/manager/dashboard');
        } else if (userRole === 'sales_rep') {
          navigate('/sales-rep/dashboard');
        }
      }
    });

    // Check if user is already signed in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const userRole = session.user.user_metadata.role;
        if (userRole === 'director') {
          navigate('/director/dashboard');
        } else if (userRole === 'manager') {
          navigate('/manager/dashboard');
        } else if (userRole === 'sales_rep') {
          navigate('/sales-rep/dashboard');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Override the default signup handler to include role
  const authConfig = {
    providers: [],
    onSignUp: async ({ email, password }: { email: string; password: string }) => {
      if (!selectedRole) {
        setError('Please select a role before signing up');
        return false;
      }
      setError('');
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: selectedRole,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return false;
      }

      return true;
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            RampUP Platform
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access your dashboard
          </p>
        </div>
        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="mb-6">
            <Label htmlFor="role">Select Role (for Sign Up)</Label>
            <Select onValueChange={setSelectedRole} value={selectedRole}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales_rep">Sales Representative</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="director">Director</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme="light"
            {...authConfig}
          />
        </div>
      </div>
    </div>
  );
}