// pages/api/wishes/create.js
import { supabaseAdmin } from "../../../lib/supabaseClient";
import { sendEmail } from "../../../lib/mail";

export default async function handler(req, res) {
  // Allow only POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, title, description, amount } = req.body;

  // Validate all required fields
  if (!name || !email || !title || !description || !amount) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Validate amount
  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({ error: "Invalid amount value" });
  }

  try {
    const supa = supabaseAdmin();

    // 🔹 1️⃣ Get or create user
    const { data: existingUser, error: userFetchError } = await supa
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (userFetchError) throw userFetchError;

    let userId = existingUser?.id;

    if (!userId) {
      const { data: newUser, error: userInsertError } = await supa
        .from("users")
        .insert([{ name, email }])
        .select()
        .single();

      if (userInsertError) throw userInsertError;
      userId = newUser.id;
    }

    // 🔹 2️⃣ Prevent duplicate wishes by same user (optional safeguard)
    const { data: existingWish, error: wishCheckError } = await supa
      .from("wishes")
      .select("id")
      .eq("title", title)
      .eq("user_id", userId)
      .maybeSingle();

    if (wishCheckError) throw wishCheckError;

    if (existingWish) {
      return res.status(409).json({
        error: "A wish with this title already exists for this user.",
      });
    }

    // 🔹 3️⃣ Insert new wish
    const { data: wish, error: insertError } = await supa
      .from("wishes")
      .insert([
        {
          user_id: userId,
          name,
          title,
          description,
          amount: parsedAmount,
          status: "pending",
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (insertError) throw insertError;

    // 🔹 4️⃣ Notify admins via email
    const adminEmails = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);

    if (adminEmails.length > 0) {
      const subject = `🆕 New Wish Submitted: ${title}`;
      const html = `
        <h2>New Wish Submitted</h2>
        <p>A new wish has been created on WishHoff:</p>
        <ul>
          <li><strong>Title:</strong> ${title}</li>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Amount:</strong> $${parsedAmount.toFixed(2)}</li>
        </ul>
        <p><a href="${process.env.NEXT_PUBLIC_SITE_URL || ""}/moderation" target="_blank">Review in moderation</a></p>
      `;

      for (const to of adminEmails) {
        try {
          await sendEmail({ to, subject, html });
        } catch (e) {
          console.warn("Admin notification failed:", e?.message);
        }
      }
    }

    // 🔹 5️⃣ Return clean response
    return res.status(200).json({
      status: "success",
      message: "Wish created successfully",
      wish,
    });
  } catch (err) {
    console.error("❌ Create Wish Error:", err);
    return res.status(500).json({
      error: "Failed to create wish",
      details: err.message,
    });
  }
}