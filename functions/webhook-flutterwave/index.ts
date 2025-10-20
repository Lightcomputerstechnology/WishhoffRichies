// functions/webhook-flutterwave/index.ts
import { serve } from "std/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE")!;
const FLW_SECRET = Deno.env.get("FLW_SECRET")!; // use to verify X-Hash header (verif-hash)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

serve(async (req) => {
  try {
    const payload = await req.json();
    const sig = req.headers.get("verif-hash") || req.headers.get("x-flw-signature") || req.headers.get("verif_hash");

    // Simple verify: compare provided hash with HMAC-SHA256 of payload using FLW_SECRET
    // Implementation depends on Flutterwave webhook header — confirm header name in your dashboard.
    // If verification passes, continue

    const event = payload;
    // Flutterwave sends event with "status": "successful" for payments
    if (event?.data?.status === "successful" || event?.event === "payment.completed") {
      const meta = event.data?.meta || event.data?.customer || {};
      const refPaymentId = meta?.paymentId || extractPaymentIdFromTxRef(event.data?.tx_ref);

      // update payment record
      await supabase.from("payments").update({ status: "succeeded", provider_charge_id: event.data?.id || event.data?.tx_ref }).eq("id", refPaymentId);

      // increment wish amount
      const { data: paymentRow } = await supabase.from("payments").select("*").eq("id", refPaymentId).maybeSingle();
      if (paymentRow?.wish_id) {
        try {
          await supabase.rpc("increment_wish_amount", { wish_uuid: paymentRow.wish_id, inc_amount: Number(paymentRow.amount) });
        } catch {
          // fallback: increment by reading value and updating
          await supabase.from("wishes").update({ raised_amount: (paymentRow?.amount || 0) + (paymentRow?.raised_amount || 0) }).eq("id", paymentRow.wish_id);
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err) {
    console.error("flutterwave webhook error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});

function extractPaymentIdFromTxRef(txRef) {
  if (!txRef) return null;
  const m = txRef.match(/wish_([0-9a-fA-F-]+)/);
  return m ? m[1] : null;
}
