import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import config from './config';

// Create a safe Supabase client that handles missing environment variables
const createSafeSupabaseClient = () => {
  const url = config.supabase.url;
  const anonKey = config.supabase.anonKey;
  
  // If environment variables are not set or empty, return a mock client
  if (!url || !anonKey || url === '' || anonKey === '' || url === 'http://127.0.0.1:54321' || anonKey === 'your_anon_key_here') {
    console.warn('Supabase not configured or local instance not running. Using mock client.');
    return {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        signInWithPassword: () => Promise.resolve({ 
          data: { user: null }, 
          error: { message: 'Supabase not configured' } 
        }),
        signUp: () => Promise.resolve({ 
          data: { user: null }, 
          error: { message: 'Supabase not configured' } 
        }),
        signOut: () => Promise.resolve({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      from: () => ({
        select: () => ({ eq: () => Promise.resolve({ data: [], error: { message: 'Supabase not configured' } }) }),
        insert: () => Promise.resolve({ data: [], error: { message: 'Supabase not configured' } }),
        update: () => ({ eq: () => Promise.resolve({ data: [], error: { message: 'Supabase not configured' } }) }),
        delete: () => ({ eq: () => Promise.resolve({ data: [], error: { message: 'Supabase not configured' } }) }),
      }),
    } as any;
  }
  
  return createClient<Database>(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  });
};

export const supabase = createSafeSupabaseClient();
