import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './database.types';

let supabaseClientInstance: SupabaseClient<Database> | null = null;
let supabaseServerInstance: SupabaseClient<Database> | null = null;

// Client-side Supabase instance
export const getSupabase = (): SupabaseClient<Database> | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!supabaseClientInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your_supabase_project_url') {
      return null;
    }

    supabaseClientInstance = createClient<Database>(supabaseUrl, supabaseAnonKey);
  }

  return supabaseClientInstance;
};

// Server-side Supabase instance for API routes
export const getSupabaseServer = (): SupabaseClient<Database> | null => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your_supabase_project_url') {
    return null;
  }

  // Create a new instance for each call to ensure fresh types
  return createClient<Database>(supabaseUrl, supabaseAnonKey);
};
