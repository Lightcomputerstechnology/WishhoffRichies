// pages/api/webhooks/stripe.js
// pages/api/webhooks/stripe.js
import { buffer } from "micro";
import stripe from "../../../lib/stripe";
import { supabaseAdmin } from "../../../lib/supabaseClient";

export const config = {
  api: { bodyParser: false }, // Stripe requires the raw body
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !webhookSecret) {
    return res.status(400).json({ error: "Missing Stripe webhook signature or secret" });
  }

  let event;
  try {
    const buf = await buffer(req);
    event = stripe.webhooks.constructEvent(buf.toString(), sig, webhookSecret);
  } catch (err) {
    console.error("⚠️  Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const supa = supabaseAdmin();

  try {
    // We only handle successful payments
    if (
      event.type === "checkout.session.completed" ||
      event.type === "payment_intent.succeeded"
    ) {
      const session = event.data.object;
      const wishId = session.metadata?.wish_id || session.metadata?.wishId;
      const amount = (session.amount_total ?? session.amount) / 100;
      const donorEmail = session.customer_email || "anonymous@donor.com";
      const providerChargeId = session.payment_intent ?? session.id;

      if (!wishId || !amount) {
        console.warn("⚠️ Missing wishId or amount in webhook metadata.");
        return res.status(400).json({ error: "Missing required metadata" });
      }

      // Idempotency check: avoid duplicate donation records
      const { data: existingDonation } = await supa
        .from("donations")
        .select("id")
        .eq("provider_charge_id", providerChargeId)
        .maybeSingle();

      if (existingDonation) {
        console.log("ℹ️ Donation already recorded, skipping duplicate webhook.");
        return res.status(200).json({ received: true });
      }

      // Get or create donor
      let donorId;
      const { data: existingUser } = await supa
        .from("users")
        .select("id")
        .eq("email", donorEmail)
        .maybeSingle();

      if (existingUser) {
        donorId = existingUser.id;
      } else {
        const { data: newUser, error: userErr } = await supa
          .from("users")
          .insert([{ email: donorEmail }])
          .select()
          .single();
        if (userErr) throw userErr;
        donorId = newUser.id;
      }

      // Record donation
      const { error: donationErr } = await supa.from("donations").insert([
        {
          wish_id: wishId,
          donor_id: donorId,
          amount,
          currency: session.currency ?? "USD",
          provider: "stripe",
          provider_charge_id: providerChargeId,
          status: "succeeded",
          created_at: new Date().toISOString(),
        },
      ]);
      if (donationErr) throw donationErr;

      // Increment wish progress
      const { error: rpcErr } = await supa.rpc("increment_wish_amount", {
        wish_uuid: wishId,
        inc_amount: amount,
      });
      if (rpcErr) throw rpcErr;

      console.log(`✅ Donation recorded: Wish ${wishId} +$${amount}`);
    }

    // Always respond 200 to prevent Stripe retries
    res.status(200).json({ received: true });
  } catch (err) {
    console.error("❌ Error processing webhook:", err.message);
    // Respond 200 so Stripe doesn't retry indefinitely, but log error
    res.status(200).json({ received: true, warning: err.message });
  }
}
