// pages/api/wishes.js
// pages/api/wishes.js
import { supabaseAdmin } from "../../lib/supabaseClient";

export default async function handler(req, res) {
  try {
    const supa = supabaseAdmin(); // Server-side Supabase client (with service role key)

    // Handle GET requests — fetch wishes
    if (req.method === "GET") {
      const { status } = req.query;
      let query = supa
        .from("wishes")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (status) query = query.eq("status", status);

      const { data, error } = await query;
      if (error) throw error;

      return res.status(200).json(data);
    }

    // Handle POST requests — create a new wish
    if (req.method === "POST") {
      const { title, description, amount_target, currency = "USD", user_id = null } = req.body;

      if (!title || !description || !amount_target) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const { data, error } = await supa
        .from("wishes")
        .insert([
          {
            user_id,
            title: title.trim(),
            description: description.trim(),
            amount_target: Number(amount_target),
            currency,
            status: "pending",
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      return res.status(201).json({ message: "Wish created successfully", wish: data });
    }

    // Unsupported method
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });

  } catch (err) {
    console.error("Wish API Error:", err.message);
    return res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}
