import { createClient } from '@supabase/supabase-js';

// Get these values from your Supabase project settings -> API
const supabaseUrl = 'https://cyqiqcpvbsgayzdglssx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5cWlxY3B2YnNnYXl6ZGdsc3N4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY1MDY3MjMsImV4cCI6MjA1MjA4MjcyM30.YAN2OQOYIjXcm7_DLYNA_DAOvAxOk0R_gG2SsozdEYw';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);