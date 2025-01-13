import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';

/**
 * AuthForm component that renders the Supabase Auth UI
 * Customized with the application's theme and styling
 */
export function AuthForm() {
  return (
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
  );
}