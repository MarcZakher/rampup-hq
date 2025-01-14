import { useState } from 'react';
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const AuthForm = () => {
  const [selectedRole, setSelectedRole] = useState<string>("sales_rep");

  return (
    <div className="mt-8">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select your role
        </label>
        <Select
          value={selectedRole}
          onValueChange={(value) => setSelectedRole(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sales_rep">Sales Representative</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="director">Director</SelectItem>
          </SelectContent>
        </Select>
      </div>
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
        additionalData={{
          role: selectedRole
        }}
      />
    </div>
  );
};