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