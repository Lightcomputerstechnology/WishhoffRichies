import { serve } from "std/server";
import { createClient } from "@supabase/supabase-js";

// ✅ Use working variable names
const SERVICE_URL = Deno.env.get("SERVICE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY")!;
const NOWPAYMENTS_WEBHOOK_KEY = Deno.env.get("NOWPAYMENTS_WEBHOOK_KEY")!; // set this in Supabase to match NowPayments webhook secret

const supabase = createClient(SERVICE_URL, SERVICE_ROLE_KEY);

serve(async (req) => {
  try {
    const payload = await req.json();

    // ✅ Verify webhook authenticity (important)
    const headerKey =
      req.headers.get("x-api-key") ||
      req.headers.get("X-Api-Key") ||
      req.headers.get("Authorization");

    // If your NowPayments webhook sends a secret, validate it here.
    if (headerKey && headerKey !== NOWPAYMENTS_WEBHOOK_KEY) {
      console.warn("❌ NowPayments webhook rejected: invalid secret key");
      return new Response("Invalid signature", { status: 401 });
    }

    // ✅ Get payment status and order ID
    const status =
      payload?.payment_status ||
      payload?.status ||
      payload?.payment?.status;

    if (["confirmed", "finished", "paid"].includes(status)) {
      const orderId = payload?.order_id || payload?.payment?.order_id;
      const refPaymentId = orderId; // You used payment.id as order_id in init-payment

      if (!refPaymentId) {
        console.error("⚠️ Missing orderId/paymentId in NowPayments webhook");
        return new Response("Missing orderId", { status: 400 });
      }

      // ✅ Update payment to succeeded
      await supabase
        .from("payments")
        .update({
          status: "succeeded",
          provider_charge_id: payload.id || payload.payment?.id,
        })
        .eq("id", refPaymentId);

      // ✅ Update wish raised amount
      const { data: paymentRow } = await supabase
        .from("payments")
        .select("*")
        .eq("id", refPaymentId)
        .maybeSingle();

      if (paymentRow?.wish_id) {
        try {
          await supabase.rpc("increment_wish_amount", {
            wish_uuid: paymentRow.wish_id,
            inc_amount: Number(paymentRow.amount),
          });
        } catch (err) {
          console.warn("RPC fallback (NowPayments):", err);
          // fallback: manual update
          const { data: wishData } = await supabase
            .from("wishes")
            .select("raised_amount")
            .eq("id", paymentRow.wish_id)
            .maybeSingle();

          if (wishData) {
            await supabase
              .from("wishes")
              .update({
                raised_amount:
                  Number(wishData.raised_amount || 0) +
                  Number(paymentRow.amount || 0),
              })
              .eq("id", paymentRow.wish_id);
          }
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err: any) {
    console.error("🔥 NowPayments webhook error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});