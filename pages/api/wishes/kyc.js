import { supabaseAdmin } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { userId, fileUrl } = req.body;
  if (!userId || !fileUrl) return res.status(400).json({ error: "Missing parameters" });

  try {
    const supa = supabaseAdmin();
    const { data, error } = await supa.from("kyc_documents").insert([{ user_id: userId, file_url: fileUrl, status: "submitted", created_at: new Date().toISOString() }]).select().single();
    if (error) throw error;
    return res.status(200).json(data);
  } catch (err) {
    console.error("kyc upload error:", err);
    return res.status(500).json({ error: "Failed to submit KYC" });
  }
}
