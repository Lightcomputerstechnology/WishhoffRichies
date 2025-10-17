import { supabaseAdmin } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, title, description, amount } = req.body;

  if (!name || !email || !title || !description || !amount) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const supa = supabaseAdmin();

    // 1️⃣ Create or get existing user
    const { data: existingUser } = await supa
      .from("users")
      .select("*")
      .eq("email", email)
      .limit(1)
      .maybeSingle();

    let userId = existingUser?.id;
    if (!userId) {
      const { data: newUser, error: userError } = await supa
        .from("users")
        .insert([{ name, email }])
        .select()
        .single();

      if (userError) throw userError;
      userId = newUser.id;
    }

    // 2️⃣ Create the wish
    const { data, error } = await supa
      .from("wishes")
      .insert([
        {
          title,
          description,
          amount,
          user_id: userId,
          status: "open",
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({ success: true, wish: data });
  } catch (err) {
    console.error("Wish creation error:", err);
    res.status(500).json({ error: "Failed to create wish" });
  }
}
