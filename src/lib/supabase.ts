import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Graceful fallback logger to help developers configure .env easily
if (!supabaseUrl || supabaseUrl.includes('your-supabase-project')) {
  console.warn(
    'Supabase URL configuration is missing or holds a placeholder. Please configure VITE_SUPABASE_URL in your local .env file.'
  );
}

if (!supabaseAnonKey || supabaseAnonKey.includes('your-supabase-anon')) {
  console.warn(
    'Supabase Anon Key configuration is missing or holds a placeholder. Please configure VITE_SUPABASE_ANON_KEY in your local .env file.'
  );
}

// Initializing the Client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
