import { createClient } from "@supabase/supabase-js";

// Admin client for server-side usage (API routes, webhooks)
export const supabaseAdmin = () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRole) {
    throw new Error("Missing Supabase environment variables.");
  }

  return createClient(supabaseUrl, supabaseServiceRole);
};

// Public client for frontend
export const supabasePublic = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing public Supabase environment variables.");
  }

  return createClient(supabaseUrl, supabaseAnonKey);
};

// ✅ Default export for client-side use
export const supabase = supabasePublic();
export default supabase;
