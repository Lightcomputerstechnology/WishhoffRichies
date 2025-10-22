import { serve } from "std/server";
import { createClient } from "@supabase/supabase-js";

// ✅ Use your working variable names (not starting with SUPABASE_)
const SERVICE_URL = Deno.env.get("SERVICE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY")!;
const SETTINGS_UPDATE_SECRET = Deno.env.get("SETTINGS_UPDATE_SECRET")!;

const supabase = createClient(SERVICE_URL, SERVICE_ROLE_KEY);

serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    // ✅ Verify secret (protect route)
    const authHeader = req.headers.get("authorization");
    if (!authHeader || authHeader !== `Bearer ${SETTINGS_UPDATE_SECRET}`) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { key, value } = await req.json();
    if (!key || value === undefined) {
      return new Response("Bad request", { status: 400 });
    }

    // ✅ Upsert the setting
    const { data, error } = await supabase
      .from("settings")
      .upsert({ key, value }, { onConflict: "key" })
      .select()
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (err: any) {
    console.error("⚠️ settings-update error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});