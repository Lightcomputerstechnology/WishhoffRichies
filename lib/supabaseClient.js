// lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

/**
 * ✅ Public Supabase client
 * Used on the client side (browser) for safe, user-level operations.
 * Never expose your service role key here!
 */
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/**
 * ✅ Admin Supabase client
 * Used only on the server side (API routes) with elevated privileges.
 * Uses the service role key securely stored in environment variables.
 */
export const supabaseAdmin = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("Supabase environment variables are missing!");
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
};
