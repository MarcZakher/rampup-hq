// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://cyqiqcpvbsgayzdglssx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5cWlxY3B2YnNnYXl6ZGdsc3N4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY1MDY3MjMsImV4cCI6MjA1MjA4MjcyM30.YAN2OQOYIjXcm7_DLYNA_DAOvAxOk0R_gG2SsozdEYw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);