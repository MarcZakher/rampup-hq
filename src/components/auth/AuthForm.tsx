import { useState } from 'react';
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { supabase } from '@/integrations/supabase/client';
import { RoleSelector } from './RoleSelector';
import { authUiConfig } from './auth-ui-config';

export const AuthForm = () => {
  const [selectedRole, setSelectedRole] = useState<string>("sales_rep");

  return (
    <div className="mt-8">
      <RoleSelector 
        value={selectedRole}
        onChange={(value) => setSelectedRole(value)}
      />
      <SupabaseAuth
        supabaseClient={supabase}
        appearance={authUiConfig}
        providers={[]}
        additionalData={{
          role: selectedRole
        }}
      />
    </div>
  );
};