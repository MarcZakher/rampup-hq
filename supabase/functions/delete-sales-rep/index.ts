import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const { user_id } = await req.json()
    if (!user_id) {
      throw new Error('No user_id provided')
    }

    // Verify the requester is authenticated
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )
    if (authError) throw authError
    if (!user) throw new Error('Not authenticated')

    console.log('Authenticated user:', user.id)

    // First verify if the user is a manager
    const { data: managerData, error: managerError } = await supabaseClient
      .from('user_roles')
      .select('*')
      .eq('user_id', user.id)
      .eq('role', 'manager')
      .single()

    if (managerError) {
      console.error('Error checking manager role:', managerError)
      throw new Error('Error verifying manager role')
    }

    if (!managerData) {
      throw new Error('Unauthorized - only managers can delete sales representatives')
    }

    console.log('Manager verified:', managerData)

    // Verify the sales rep belongs to this manager
    const { data: salesRepRole, error: salesRepError } = await supabaseClient
      .from('user_roles')
      .select('*')
      .eq('user_id', user_id)
      .eq('role', 'sales_rep')
      .eq('manager_id', user.id)
      .single()

    if (salesRepError) {
      console.error('Error checking sales rep:', salesRepError)
      throw new Error('Error verifying sales representative')
    }

    if (!salesRepRole) {
      throw new Error('Unauthorized - you can only delete your own sales representatives')
    }

    console.log('Sales rep verified:', salesRepRole)

    // First delete the user role
    const { error: deleteRoleError } = await supabaseAdmin
      .from('user_roles')
      .delete()
      .eq('user_id', user_id)

    if (deleteRoleError) {
      console.error('Error deleting user role:', deleteRoleError)
      throw deleteRoleError
    }

    console.log('User role deleted')

    // Then delete the profile
    const { error: deleteProfileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', user_id)

    if (deleteProfileError) {
      console.error('Error deleting profile:', deleteProfileError)
      throw deleteProfileError
    }

    console.log('Profile deleted')

    // Finally delete the user using admin client
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(
      user_id
    )

    if (deleteError) {
      console.error('Error deleting user:', deleteError)
      throw deleteError
    }

    console.log('User deleted successfully')

    return new Response(
      JSON.stringify({ message: 'User deleted successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error in delete-sales-rep function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})