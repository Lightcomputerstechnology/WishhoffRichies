// pages/api/wishes.js
import { supabaseAdmin } from "../../lib/supabaseClient";

export default async function handler(req, res) {
  const supa = supabaseAdmin(); // service role for server-side actions
  if (req.method === "GET") {
    const { status } = req.query;
    const q = supa.from("wishes").select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (status) q.eq("status", status);
    const { data, error } = await q;
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }

  if (req.method === "POST") {
    // create wish server-side (safer if you validate more fields)
    const { title, description, amount_target, currency = "USD", user_id = null } = req.body;
    if (!title || !description || !amount_target) return res.status(400).json({ error: "missing" });

    const { data, error } = await supa.from("wishes").insert([{
      user_id,
      title,
      description,
      amount_target,
      currency,
      status: "pending"
    }]).select().single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  res.status(405).end();
}
