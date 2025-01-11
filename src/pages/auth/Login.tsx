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
import { AuthChangeEvent, Session } from '@supabase/supabase-js';

export default function Login() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [view, setView] = useState<'sign_in' | 'sign_up'>('sign_in');

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      if (event === AuthChangeEvent.SIGNED_IN && session) {
        const { data: { user } } = await supabase.auth.getUser();
        const userRole = user?.user_metadata?.role;

        if (userRole === 'director') {
          navigate('/director/dashboard');
        } else if (userRole === 'manager') {
          navigate('/manager/dashboard');
        } else if (userRole === 'sales_rep') {
          navigate('/sales-rep/dashboard');
        }
      }
    });

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

  // Listen for auth state changes to handle role selection
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent) => {
      if (event === AuthChangeEvent.SIGNED_UP && selectedRole) {
        const { error: updateError } = await supabase.auth.updateUser({
          data: { role: selectedRole }
        });

        if (updateError) {
          setError(updateError.message);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [selectedRole]);

  const handleViewChange = (newView: 'sign_in' | 'sign_up') => {
    setView(newView);
    setError('');
    if (newView === 'sign_in') {
      setSelectedRole('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#9b87f5] via-[#7E69AB] to-[#6E59A5] p-4">
      <div className="w-full max-w-md space-y-8 relative">
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#D6BCFA] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-8 -right-4 w-32 h-32 bg-[#9b87f5] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-300"></div>
        
        <div className="relative bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl p-8 space-y-6 border border-purple-100">
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-[#9b87f5] to-[#6E59A5] bg-clip-text text-transparent">
              RampUP
            </h2>
            <p className="text-gray-600">
              Accelerate your sales journey
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4 bg-red-50 border-red-200">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {view === 'sign_up' && (
            <div className="space-y-2 mb-4">
              <Label htmlFor="role" className="text-gray-700">Select Your Role</Label>
              <Select onValueChange={setSelectedRole} value={selectedRole}>
                <SelectTrigger id="role" className="w-full bg-white border-purple-200 focus:ring-purple-200">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales_rep">Sales Representative</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="director">Director</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#9b87f5',
                    brandAccent: '#7E69AB',
                    inputBackground: 'white',
                    inputBorder: '#e2e8f0',
                    inputBorderFocus: '#9b87f5',
                    inputBorderHover: '#7E69AB',
                  },
                },
              },
              className: {
                button: 'bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] hover:from-[#7E69AB] hover:to-[#6E59A5] text-white font-medium py-2 px-4 rounded-lg transition-all duration-200',
                input: 'bg-white border-gray-200 focus:border-purple-300 focus:ring-purple-200',
                label: 'text-gray-700',
              },
            }}
            providers={[]}
            magicLink={false}
          />
        </div>
      </div>
    </div>
  );
}