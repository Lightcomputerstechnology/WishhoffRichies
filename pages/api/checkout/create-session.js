// pages/api/checkout/create-session.js
import stripe from "../../../lib/stripe";
import { supabaseAdmin } from "../../../lib/supabaseClient";

/**
 * Creates a Stripe Checkout session for a specific wish donation.
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const { wishId, amount, currency = "USD", donorEmail } = req.body;

  if (!wishId || !amount) {
    return res
      .status(400)
      .json({ error: "Missing required fields: wishId or amount" });
  }

  try {
    // Verify that the wish exists
    const { data: wish, error: wishError } = await supabaseAdmin
      .from("wishes")
      .select("id, title")
      .eq("id", wishId)
      .single();

    if (wishError || !wish) {
      return res.status(404).json({ error: "Wish not found" });
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://wishhoffrichies.onrender.com";

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
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

    return res.status(200).json({ checkout_url: session.url });
  } catch (err) {
    console.error("Stripe Checkout Error:", err);
    return res.status(500).json({
      error: "Failed to create checkout session",
      details: err.message,
    });
  }
}
