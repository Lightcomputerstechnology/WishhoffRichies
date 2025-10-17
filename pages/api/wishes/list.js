import { supabaseAdmin } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const supa = supabaseAdmin();

    const { data, error } = await supa
      .from("wishes")
      .select("id, title, description, amount, status, created_at")
      .eq("status", "open")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching wishes:", err);
    res.status(500).json({ error: "Failed to fetch wishes" });
  }
}
