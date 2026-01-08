import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please set SUPABASE_URL and SUPABASE_ANON_KEY.",
  );
}

// Server-side Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Create a Supabase client with a specific access token (for authenticated requests)
export function createSupabaseClient(
  accessToken?: string,
): SupabaseClient<Database> {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: accessToken
        ? {
          Authorization: `Bearer ${accessToken}`,
        }
        : {},
    },
  });
}

// Get Supabase config for client-side
export function getSupabaseConfig() {
  return {
    url: supabaseUrl,
    anonKey: supabaseAnonKey,
  };
}

// Create admin Supabase client with service role key (for server-side admin operations)
export function createAdminSupabaseClient(): SupabaseClient<Database> {
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY environment variable. This is required for admin operations.",
    );
  }

  // Trim whitespace in case there's any
  const trimmedKey = serviceRoleKey.trim();

  if (!trimmedKey || trimmedKey.length === 0) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is empty. Please check your environment variables.",
    );
  }

  return createClient<Database>(supabaseUrl, trimmedKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
