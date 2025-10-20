// supabase/functions/create-wish/index.js
import { createClient } from "@supabase/supabase-js";

// ✅ Create Supabase client using environment variables
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const ADMIN_EMAILS = (Deno.env.get("ADMIN_EMAILS") || "")
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean);
const SITE_URL = Deno.env.get("NEXT_PUBLIC_SITE_URL") || "";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ✅ Start Deno server (Edge Function)
Deno.serve(async (req) => {
  try {
    // Restrict to POST requests only
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { name, email, title, description, amount } = body;

    // Validate required fields
    if (!name || !email || !title || !description || !amount) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ✅ Step 1: Get or create user record
    const { data: existingUser, error: existingUserError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (existingUserError) throw existingUserError;

    let userId = existingUser?.id;
    if (!userId) {
      const { data: newUser, error: newUserError } = await supabase
        .from("users")
        .insert([{ name, email }])
        .select()
        .single();
      if (newUserError) throw newUserError;
      userId = newUser.id;
    }

    // ✅ Step 2: Insert wish record
    const { data: wish, error: wishError } = await supabase
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

    if (wishError) throw wishError;

    // ✅ Step 3: Send admin email notification (optional)
    if (ADMIN_EMAILS.length > 0 && RESEND_API_KEY) {
      const subject = `🎁 New Wish Submitted: ${title}`;
      const html = `
        <p><strong>${name}</strong> has submitted a new wish!</p>
        <ul>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Title:</strong> ${title}</li>
          <li><strong>Amount:</strong> $${amount}</li>
        </ul>
        <p>Description:</p>
        <blockquote>${description}</blockquote>
        <p><a href="${SITE_URL}/moderation" style="color: #4f46e5; text-decoration: underline;">Review in Moderation</a></p>
      `;

      for (const to of ADMIN_EMAILS) {
        try {
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${RESEND_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "Light <no-reply@dealcross.net>",
              to,
              subject,
              html,
            }),
          });
        } catch (err) {
          console.error("Email send failed:", err.message);
        }
      }
    }

    // ✅ Return success
    return new Response(JSON.stringify({ success: true, wish }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("create-wish error:", err);
    return new Response(
      JSON.stringify({
        error: "Failed to create wish",
        details: err.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
