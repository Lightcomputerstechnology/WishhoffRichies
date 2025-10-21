// lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

/**
 * ✅ Public Supabase client
 * Used on the client side (browser) for safe, user-level operations.
 * Never expose your service role key here!
 *
 * NOTE:
 * The auth-helpers packages already handle session persistence globally
 * through the SessionContextProvider in _app.js.
 */
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/**
 * ✅ Admin Supabase client (for server-side API routes only)
 * Use this for backend logic — e.g., checking user wishes in API routes.
 *
 * IMPORTANT:
 * Do not import this into client components.
 */
export const getSupabaseAdmin = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("❌ Missing Supabase environment variables!");
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
};