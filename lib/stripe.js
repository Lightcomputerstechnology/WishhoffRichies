// lib/stripe.js
import Stripe from "stripe";

/**
 * ✅ Secure Stripe instance
 * Used for all server-side Stripe operations like:
 * - Creating checkout sessions
 * - Handling webhooks
 * - Managing payments
 */

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("❌ Missing Stripe Secret Key in environment variables");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2023-10-16",
  typescript: false, // ensures compatibility even if TS isn't used
});

export default stripe;
