// functions/settings-update/index.ts
import { serve } from "std/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE")!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

serve(async (req) => {
  try {
    if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
    // You must protect this route: only allow admin callers (via a secret or JWT)
    const authHeader = req.headers.get("authorization");
    if (!authHeader || authHeader !== `Bearer ${Deno.env.get("SETTINGS_UPDATE_SECRET")}`) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { key, value } = await req.json();
    if (!key || value === undefined) return new Response("Bad request", { status: 400 });

    const { data, error } = await supabase
      .from("settings")
      .upsert({ key, value }, { onConflict: "key" })
      .select()
      .single();

    if (error) throw error;
    return new Response(JSON.stringify({ success: true, data }), { status: 200 });
  } catch (err) {
    console.error("settings-update error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
