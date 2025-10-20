// pages/api/wishes/create.js
import { supabaseAdmin } from "../../../lib/supabaseClient";
import { sendEmail } from "../../../lib/mail";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { name, email, title, description, amount } = req.body;
  if (!name || !email || !title || !description || !amount) return res.status(400).json({ error: "missing fields" });

  try {
    const supa = supabaseAdmin();
    // Get or create user
    const { data: existing } = await supa.from("users").select("*").eq("email", email).limit(1).maybeSingle();
    let userId = existing?.id;
    if (!userId) {
      const { data: newUser, error: uErr } = await supa.from("users").insert([{ name, email }]).select().single();
      if (uErr) throw uErr;
      userId = newUser.id;
    }

    const { data, error } = await supa.from("wishes").insert([{
      user_id: userId,
      name,
      title,
      description,
      amount,
      status: "pending",
      created_at: new Date().toISOString()
    }]).select().single();

    if (error) throw error;

    // Notify admin(s) by email (you can maintain a list of admin emails in env var or a table)
    const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim()).filter(Boolean);
    if (adminEmails.length > 0) {
      const subject = `New wish submitted: ${title}`;
      const html = `<p>A new wish has been submitted:</p>
        <ul>
          <li><strong>Title:</strong> ${title}</li>
          <li><strong>Name:</strong> ${name} (${email})</li>
          <li><strong>Amount:</strong> $${amount}</li>
        </ul>
        <p><a href="${process.env.NEXT_PUBLIC_SITE_URL || ""}/moderation">Review in moderation</a></p>`;
      for (const to of adminEmails) {
        try { await sendEmail({ to, subject, html }); } catch (e) { console.warn("admin notify failed", e?.message); }
      }
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("create wish error:", err);
    return res.status(500).json({ error: "Failed to create wish" });
  }
}