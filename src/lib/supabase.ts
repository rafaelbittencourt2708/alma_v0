import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const createSupabaseClient = (clerkToken?: string, organizationId?: string) => {
  const headers: Record<string, string> = {};
  
  if (clerkToken) {
    headers['Authorization'] = `Bearer ${clerkToken}`;
  }

  if (organizationId) {
    headers['x-organization-id'] = organizationId;
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers,
    },
  });
};

// Client for server-side operations
export const supabaseServer = createSupabaseClient();

// Helper function to get organization-scoped client
export const getOrganizationClient = async (organizationId: string, clerkToken?: string) => {
  return createSupabaseClient(clerkToken, organizationId);
};
