import { serve } from "std/server";
import { createClient } from "@supabase/supabase-js";

// ✅ Use your actual working Supabase env variable names
const SERVICE_URL = Deno.env.get("SERVICE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY")!;
const FLW_WEBHOOK_SECRET = Deno.env.get("FLW_WEBHOOK_SECRET")!; // from Flutterwave Dashboard

const supabase = createClient(SERVICE_URL, SERVICE_ROLE_KEY);

serve(async (req) => {
  try {
    // ✅ Get and verify Flutterwave webhook signature
    const signature =
      req.headers.get("verif-hash") ||
      req.headers.get("x-flw-signature") ||
      req.headers.get("verif_hash");

    if (!signature || signature !== FLW_WEBHOOK_SECRET) {
      console.error("❌ Invalid Flutterwave webhook signature");
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    // ✅ Parse the webhook payload
    const event = await req.json();

    if (
      event?.data?.status === "successful" ||
      event?.event === "payment.completed"
    ) {
      const meta = event.data?.meta || {};
      const refPaymentId =
        meta?.paymentId || extractPaymentIdFromTxRef(event.data?.tx_ref);

      if (!refPaymentId) {
        console.error("⚠️ Missing paymentId in webhook");
        return new Response(JSON.stringify({ error: "No paymentId found" }), {
          status: 400,
        });
      }

      // ✅ Update payment status to succeeded
      await supabase
        .from("payments")
        .update({
          status: "succeeded",
          provider_charge_id: event.data?.id || event.data?.tx_ref,
        })
        .eq("id", refPaymentId);

      // ✅ Fetch payment details to update related wish
      const { data: paymentRow } = await supabase
        .from("payments")
        .select("*")
        .eq("id", refPaymentId)
        .maybeSingle();

      if (paymentRow?.wish_id) {
        try {
          // Prefer stored procedure if it exists
          await supabase.rpc("increment_wish_amount", {
            wish_uuid: paymentRow.wish_id,
            inc_amount: Number(paymentRow.amount),
          });
        } catch (e) {
          // Fallback update
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
    console.error("🔥 Flutterwave webhook error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});

function extractPaymentIdFromTxRef(txRef: string | null) {
  if (!txRef) return null;
  const m = txRef.match(/wish_([0-9a-fA-F-]+)/);
  return m ? m[1] : null;
}