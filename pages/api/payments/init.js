// pages/api/payments/init.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // The base Supabase URL, e.g. https://abc.supabase.co
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL in environment");
    }

    // Convert to Supabase Functions endpoint:
    const fnBase = supabaseUrl.replace(".supabase.co", ".functions.supabase.co");

    // Call your Supabase Edge Function
    const resp = await fetch(`${fnBase}/init-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const data = await resp.json();

    if (!resp.ok) {
      console.error("❌ init-payment failed:", data);
      return res.status(resp.status).json({
        error: data.error || "Payment initialization failed",
      });
    }

    // ✅ Success
    return res.status(200).json(data);
  } catch (err) {
    console.error("💥 API /payments/init error:", err);
    return res.status(500).json({ error: err.message });
  }
}
