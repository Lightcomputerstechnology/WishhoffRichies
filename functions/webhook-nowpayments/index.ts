// functions/webhook-nowpayments/index.ts
import { serve } from "std/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE")!;
const NOWPAYMENTS_KEY = Deno.env.get("NOWPAYMENTS_KEY")!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

serve(async (req) => {
  try {
    const payload = await req.json();
    // NowPayments sends events; verify X-API-Key header if used:
    const apiKeyHeader = req.headers.get("x-api-key") || req.headers.get("X-Api-Key");
    // If you set a webhook secret, check it here (NowPayments docs)
    // For now, we assume the header matches NOWPAYMENTS_KEY
    if (apiKeyHeader && apiKeyHeader !== NOWPAYMENTS_KEY) {
      console.warn("NowPayments: invalid api-key header");
      return new Response("Invalid", { status: 400 });
    }

    // Example: if invoice created or paid
    const status = payload?.payment_status || payload?.status || payload?.payment?.status;
    // if paid/confirmed
    if (status === "confirmed" || status === "finished" || status === "paid") {
      const orderId = payload?.order_id || payload?.payment?.order_id;
      const refPaymentId = orderId; // we used payment.id as order id earlier
      // update DB
      await supabase.from("payments").update({ status: "succeeded", provider_charge_id: payload.id || payload.payment?.id }).eq("id", refPaymentId);

      // increment wish
      const { data: paymentRow } = await supabase.from("payments").select("*").eq("id", refPaymentId).maybeSingle();
      if (paymentRow?.wish_id) {
        try {
          await supabase.rpc("increment_wish_amount", { wish_uuid: paymentRow.wish_id, inc_amount: Number(paymentRow.amount) });
        } catch {
          await supabase.from("wishes").update({ raised_amount: (paymentRow?.amount || 0) + (paymentRow?.raised_amount || 0) }).eq("id", paymentRow.wish_id);
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err) {
    console.error("nowpayments webhook error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
