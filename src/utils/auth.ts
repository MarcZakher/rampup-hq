import { AuthError, AuthApiError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export async function getCurrentUserCompanyId() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No authenticated user');

  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', user.id)
    .single();

  if (!profile?.company_id) throw new Error('User has no associated company');
  return profile.company_id;
}

export function getErrorMessage(error: AuthError) {
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
}