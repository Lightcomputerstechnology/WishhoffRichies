// pages/api/checkout/create-session.js
import stripe from "../../../lib/stripe";
import { supabaseAdmin } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { wishId, amount, currency = "USD", donorEmail } = req.body;
  if (!wishId || !amount) return res.status(400).json({ error: "missing" });

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: donorEmail,
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: `Donation to wish ${wishId}` },
            unit_amount: Math.round(parseFloat(amount) * 100)
          },
          quantity: 1
        }
      ],
      metadata: { wish_id: wishId },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/wish/${wishId}?status=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/wish/${wishId}?status=cancel`
    });

    res.json({ id: session.id, url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
