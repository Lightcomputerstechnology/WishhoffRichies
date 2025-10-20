import { serve } from "std/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE")!;
const PAYSTACK_SECRET = Deno.env.get("PAYSTACK_SECRET")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

serve(async (req) => {
  try {
    const rawBody = await req.text();
    const sigHeader =
      req.headers.get("x-paystack-signature") ||
      req.headers.get("X-Paystack-Signature");

    // ✅ Verify signature using SHA512 HMAC manually
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

    // ✅ Parse and process event
    let payload: any = {};
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
      });
    }

    if (
      payload.event === "charge.success" ||
      payload.event === "transaction.success"
    ) {
      const data = payload.data;
      const paymentId =
        data?.metadata?.payment_id ||
        extractPaymentIdFromReference(data?.reference);

      if (!paymentId) {
        console.warn("No payment ID found in webhook payload");
        return new Response(JSON.stringify({ error: "Missing payment ID" }), {
          status: 400,
        });
      }

      // Fetch payment record
      const { data: paymentRow, error: paymentErr } = await supabase
        .from("payments")
        .select("*")
        .eq("id", paymentId)
        .maybeSingle();

      if (paymentErr || !paymentRow) {
        console.error("Payment not found:", paymentErr);
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

      // ✅ Update wish raised_amount
      if (paymentRow.wish_id) {
        try {
          await supabase.rpc("increment_wish_amount", {
            wish_uuid: paymentRow.wish_id,
            inc_amount: Number(paymentRow.amount),
          });
        } catch {
          // fallback if RPC doesn’t exist
          const { data: wish } = await supabase
            .from("wishes")
            .select("raised_amount")
            .eq("id", paymentRow.wish_id)
            .single();
          const newTotal =
            (wish?.raised_amount || 0) + Number(paymentRow.amount);
          await supabase
            .from("wishes")
            .update({ raised_amount: newTotal })
            .eq("id", paymentRow.wish_id);
        }
      }

      console.log(`✅ Payment ${paymentId} marked as succeeded`);
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err) {
    console.error("💥 Paystack Webhook Error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
});

// 🔧 Helper: Extract payment ID from tx_ref
function extractPaymentIdFromReference(ref: string | undefined) {
  if (!ref) return null;
  const match = ref.match(/wish_([a-zA-Z0-9-]+)/);
  return match ? match[1] : null;
}