import { serve } from "std/server";
import { createClient } from "@supabase/supabase-js";

// ✅ Use your working environment variable pattern
const SERVICE_URL = Deno.env.get("SERVICE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY")!;
const PAYSTACK_SECRET = Deno.env.get("PAYSTACK_SECRET")!;

const supabase = createClient(SERVICE_URL, SERVICE_ROLE_KEY);

serve(async (req) => {
  try {
    const rawBody = await req.text();
    const sigHeader =
      req.headers.get("x-paystack-signature") ||
      req.headers.get("X-Paystack-Signature");

    // ✅ Verify signature (HMAC-SHA512)
    const encoder = new TextEncoder();
    const keyData = encoder.encode(PAYSTACK_SECRET);
    const msgUint8 = encoder.encode(rawBody);

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-512" },
      false,
      ["sign"]
    );

    const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, msgUint8);
    const computedSig = Array.from(new Uint8Array(signatureBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (!sigHeader || computedSig !== sigHeader) {
      console.warn("❌ Invalid Paystack signature");
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 400,
      });
    }

    // ✅ Parse JSON
    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
      });
    }

    // ✅ Process successful transaction
    if (
      payload.event === "charge.success" ||
      payload.event === "transaction.success"
    ) {
      const data = payload.data;
      const paymentId =
        data?.metadata?.paymentId || // this must match how you send it from init-payment
        extractPaymentIdFromReference(data?.reference);

      if (!paymentId) {
        console.warn("⚠️ No payment ID found in webhook payload");
        return new Response(JSON.stringify({ error: "Missing payment ID" }), {
          status: 400,
        });
      }

      // ✅ Get payment record
      const { data: paymentRow, error: paymentErr } = await supabase
        .from("payments")
        .select("*")
        .eq("id", paymentId)
        .maybeSingle();

      if (paymentErr || !paymentRow) {
        console.error("❌ Payment not found:", paymentErr);
        return new Response(JSON.stringify({ error: "Payment not found" }), {
          status: 404,
        });
      }

      // ✅ Mark payment succeeded
      await supabase
        .from("payments")
        .update({
          status: "succeeded",
          provider_charge_id: data?.id || data?.reference,
        })
        .eq("id", paymentId);

      // ✅ Update wish raised amount
      if (paymentRow.wish_id) {
        try {
          await supabase.rpc("increment_wish_amount", {
            wish_uuid: paymentRow.wish_id,
            inc_amount: Number(paymentRow.amount),
          });
        } catch (rpcErr) {
          console.warn("RPC fallback (Paystack):", rpcErr);
          const { data: wish } = await supabase
            .from("wishes")
            .select("raised_amount")
            .eq("id", paymentRow.wish_id)
            .maybeSingle();
          if (wish) {
            await supabase
              .from("wishes")
              .update({
                raised_amount:
                  Number(wish.raised_amount || 0) +
                  Number(paymentRow.amount || 0),
              })
              .eq("id", paymentRow.wish_id);
          }
        }
      }

      console.log(`✅ Payment ${paymentId} marked as succeeded`);
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err: any) {
    console.error("💥 Paystack Webhook Error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});

// 🔧 Helper: Extract paymentId from Paystack reference (e.g. "wish_<id>_<timestamp>")
function extractPaymentIdFromReference(ref: string | undefined) {
  if (!ref) return null;
  const match = ref.match(/wish_([a-zA-Z0-9-]+)/);
  return match ? match[1] : null;
}