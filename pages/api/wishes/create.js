import { createClient } from "@supabase/supabase-js";
import sgMail from "@sendgrid/mail";

// ✅ Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ✅ Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { user_id, title, description, category, target_amount, image_url, payment_method } = req.body;

    if (!user_id || !title || !target_amount) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // ✅ Insert the wish into Supabase
    const { data, error } = await supabase
      .from("wishes")
      .insert([
        {
          user_id,
          title,
          description,
          category,
          target_amount,
          image_url,
          payment_method,
          status: "pending",
          created_at: new Date().toISOString(),
        },
      ])
      .select("*")
      .single();

    if (error) throw error;

    // ✅ Fetch user details to email them
    const { data: userData } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("id", user_id)
      .single();

    if (userData?.email) {
      // ✅ SendGrid Email
      const msg = {
        to: userData.email,
        from: "noreply@wishhoffrichies.com",
        subject: "🎉 Wish Created Successfully!",
        html: `
          <div style="font-family: Arial, sans-serif; color: #222;">
            <h2>Hi ${userData.full_name || "there"},</h2>
            <p>Your wish <strong>"${title}"</strong> has been successfully created!</p>
            <p>Target amount: <strong>${target_amount}</strong></p>
            <p>We’ll notify you once donations start coming in.</p>
            <br/>
            <p>💫 <strong>WishhoffRichies</strong></p>
          </div>
        `,
      };

      await sgMail.send(msg);
    }

    return res.status(200).json({
      success: true,
      message: "Wish created successfully and confirmation email sent.",
      data,
    });
  } catch (err) {
    console.error("Error creating wish:", err.message);
    return res.status(500).json({
      error: "An error occurred while creating the wish.",
      details: err.message,
    });
  }
}
