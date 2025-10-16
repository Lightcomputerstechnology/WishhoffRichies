 // pages/api/checkout/create-session.js
import stripe from "../../../lib/stripe";
import { supabaseAdmin } from "../../../lib/supabaseClient";

/**
 * This API route creates a Stripe Checkout session
 * for donations toward a specific wish.
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const { wishId, amount, currency = "USD", donorEmail } = req.body;

  // Basic validation
  if (!wishId || !amount) {
    return res.status(400).json({ error: "Missing required fields: wishId or amount" });
  }

  try {
    // Optional: verify the wish actually exists in Supabase before creating a session
    const supa = supabaseAdmin();
    const { data: wish, error: wishError } = await supa
      .from("wishes")
      .select("id, title")
      .eq("id", wishId)
      .single();

    if (wishError || !wish) {
      return res.status(404).json({ error: "Wish not found" });
    }

    // Fallback in case NEXT_PUBLIC_SITE_URL isn't set
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wishhoffrichies.onrender.com";

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: donorEmail || undefined,
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: `Donation to "${wish.title}"` },
            unit_amount: Math.round(Number(amount) * 100),
          },
          quantity: 1,
        },
      ],
      metadata: { wish_id: wishId },
      success_url: `${siteUrl}/wish/${wishId}?status=success`,
      cancel_url: `${siteUrl}/wish/${wishId}?status=cancel`,
    });

    return res.status(200).json({ id: session.id, url: session.url });
  } catch (err) {
    console.error("Stripe Checkout Error:", err);
    return res.status(500).json({ error: "Failed to create checkout session", details: err.message });
  }
}
