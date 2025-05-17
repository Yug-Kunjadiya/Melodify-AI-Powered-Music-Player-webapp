import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Ensure URL doesn't have trailing slash
const cleanUrl = supabaseUrl.replace(/\/$/, '');

export const supabase = createClient(cleanUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'X-Client-Info': 'melodify',
    },
  },
});

// Test the connection
supabase.from('songs').select('count', { count: 'exact', head: true })
  .then(() => console.log('Successfully connected to Supabase'))
  .catch(error => console.error('Failed to connect to Supabase:', error));