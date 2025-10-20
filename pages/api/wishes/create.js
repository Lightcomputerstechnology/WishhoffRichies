import { createClient } from "@supabase/supabase-js";

/**
 * Initialize Supabase client using environment variables.
 * Make sure these are defined in your Render dashboard:
 *  - NEXT_PUBLIC_SUPABASE_URL
 *  - SUPABASE_SERVICE_ROLE_KEY
 *  - RESEND_API_KEY  (optional, for email notifications)
 *  - ADMIN_EMAILS    (comma-separated list of admin emails)
 *  - NEXT_PUBLIC_SITE_URL
 */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, title, description, amount } = req.body;

    if (!name || !email || !title || !description || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "";

    // ✅ Get or create user record
    const { data: existing } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    let userId = existing?.id;

    if (!userId) {
      const { data: newUser, error: userErr } = await supabase
        .from("users")
        .insert([{ name, email }])
        .select()
        .single();

      if (userErr) throw userErr;
      userId = newUser.id;
    }

    // ✅ Insert new wish
    const { data, error } = await supabase
      .from("wishes")
      .insert([
        {
          user_id: userId,
          name,
          title,
          description,
          amount,
          status: "pending",
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // ✅ Optional: send email notifications to admin
    if (ADMIN_EMAILS.length > 0 && process.env.RESEND_API_KEY) {
      const subject = `🎁 New Wish Submitted: ${title}`;
      const html = `
        <p>A new wish has been submitted:</p>
        <ul>
          <li><strong>Title:</strong> ${title}</li>
          <li><strong>Name:</strong> ${name} (${email})</li>
          <li><strong>Amount:</strong> $${amount}</li>
        </ul>
        <p><a href="${SITE_URL}/moderation" target="_blank">Review in moderation</a></p>
      `;

      for (const to of ADMIN_EMAILS) {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Light <no-reply@dealcross.net>",
            to,
            subject,
            html,
          }),
        }).catch(() => {});
      }
    }

    return res.status(200).json({
      message: "Wish created successfully",
      data,
    });
  } catch (err) {
    console.error("❌ create-wish error:", err);
    return res
      .status(500)
      .json({ error: "Failed to create wish", details: err.message });
  }
}
