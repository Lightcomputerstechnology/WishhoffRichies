import { createClient } from "@supabase/supabase-js";

/**
 * ✅ Public Supabase client
 * Used in the browser for safe operations (auth, fetch public data).
 * Never use service keys here.
 */
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/**
 * ✅ Admin Supabase client (server-side only)
 * Use in API routes, server actions, or Edge Functions.
 * Requires service role key.
 */
export const getSupabaseAdmin = () => {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    process.env.SUPA_URL; // fallback options for your env setup

  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SERVICE_ROLE_KEY; // your working key name

  if (!url || !serviceKey) {
    throw new Error(
      "❌ Missing Supabase admin credentials. Make sure SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL are set."
    );
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
};

/**
 * ✅ Export admin instance for backwards compatibility
 */
export const supabaseAdmin = getSupabaseAdmin();