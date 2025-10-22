// pages/api/payments/init.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // ✅ Prefer a generic env variable name that works everywhere
    const SUPABASE_URL =
      process.env.SERVICE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!SUPABASE_URL) {
      throw new Error("Missing SERVICE_URL (or NEXT_PUBLIC_SUPABASE_URL)");
    }

    // ✅ Build the Supabase Function endpoint dynamically
    const fnBase = SUPABASE_URL.replace(".supabase.co", ".functions.supabase.co");

    // ✅ Call your Supabase Edge Function (init-payment)
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
    return res.status(500).json({ error: err.message || "Unexpected error" });
  }
}
