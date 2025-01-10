import { createClient } from '@supabase/supabase-js';

// Get these values from your Supabase project settings -> API
const supabaseUrl = 'https://qqxqvmzhdvjbwqxvlhxr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxeHF2bXpoZHZqYndxeHZsaHhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc4MjcyMzcsImV4cCI6MjAyMzQwMzIzN30.Iu0kxwQvHvGpvPL5cQHvd8DvgAqOZyzGw-_qoGQVxrk';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);