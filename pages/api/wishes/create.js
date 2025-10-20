import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { user_id, title, description, category, target_amount, image_url, payment_method } = req.body;

      if (!title || !description) {
        return res.status(400).json({ error: "Title and description are required." });
      }

      // Save wish to Supabase
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
          },
        ])
        .select();

      if (error) throw error;

      return res.status(200).json({
        success: true,
        message: "Wish created successfully!",
        data,
      });
    } catch (err) {
      console.error("Error creating wish:", err);
      return res.status(500).json({ error: err.message || "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
