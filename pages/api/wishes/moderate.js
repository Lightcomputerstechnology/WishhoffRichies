import { supabaseAdmin } from "../../../lib/supabaseClient";
import { sendEmail } from "../../../lib/mail";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { wishId, action, note } = req.body;
  if (!wishId || !action) return res.status(400).json({ error: "Missing parameters" });

  try {
    const supa = supabaseAdmin();
    // fetch wish and owner
    const { data: wish } = await supa.from("wishes").select("*, users(email,name)").eq("id", wishId).maybeSingle();
    if (!wish) return res.status(404).json({ error: "Wish not found" });

    let updates = {};
    if (action === "approve") updates.status = "open";
    else if (action === "reject") updates.status = "rejected";
    else if (action === "flag") updates.status = "flagged";

    const { error: updateErr } = await supa.from("wishes").update(updates).eq("id", wishId);
    if (updateErr) throw updateErr;

    // send notification to owner
    if (wish.users?.email) {
      const subject = action === "approve" ? "Your wish has been approved" : action === "reject" ? "Your wish was rejected" : "Your wish has been flagged";
      const html = `<p>Hi ${wish.users.name || ""},</p>
      <p>Your wish "<strong>${wish.title}</strong>" has been ${action}.</p>
      ${note ? `<p>Moderator note: ${note}</p>` : ""}
      <p>Thanks — WishhoffRichies</p>`;
      await sendEmail({ to: wish.users.email, subject, html });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("moderation error:", err);
    return res.status(500).json({ error: "Moderation failed" });
  }
}
