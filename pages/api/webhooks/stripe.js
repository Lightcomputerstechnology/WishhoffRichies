// pages/api/webhooks/stripe.js
import { buffer } from "micro";
import stripe from "../../../lib/stripe";
import { supabaseAdmin } from "../../../lib/supabaseClient";

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const buf = await buffer(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(buf.toString(), sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const supa = supabaseAdmin();

  if (event.type === "checkout.session.completed" || event.type === "payment_intent.succeeded") {
    const session = event.type === "checkout.session.completed" ? event.data.object : event.data.object;
    const wishId = session.metadata?.wish_id ?? session.metadata?.wishId;
    const amount = (session.amount_total ?? session.amount) / 100.0;
    const donorEmail = session.customer_email;

    try {
      // create/get donor user
      const { data: existing } = await supa.from("users").select("*").eq("email", donorEmail).limit(1).maybeSingle();
      let donorId = existing?.id;
      if (!donorId) {
        const { data: newUser } = await supa.from("users").insert([{ email: donorEmail }]).select().single();
        donorId = newUser.id;
      }

      // insert donation
      await supa.from("donations").insert([{
        wish_id: wishId,
        donor_id: donorId,
        amount,
        currency: session.currency ?? "USD",
        provider: "stripe",
        provider_charge_id: session.payment_intent ?? session.id,
        status: "succeeded"
      }]);

      // safely increment wish amount using RPC function (defined in migrations.sql)
      await supa.rpc("increment_wish_amount", { wish_uuid: wishId, inc_amount: amount });

    } catch (err) {
      console.error("Error processing webhook:", err);
      // don't fail the webhook silently — but still respond 200 to avoid retries, or implement dead-letter logging
    }
  }

  res.json({ received: true });
}
