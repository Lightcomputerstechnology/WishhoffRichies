// functions/webhook-paystack/index.ts
import { serve } from "std/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE")!;
const PAYSTACK_SECRET = Deno.env.get("PAYSTACK_SECRET")!; // same secret used to initialize
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

serve(async (req) => {
  try {
    const text = await req.text();
    const sig = req.headers.get("x-paystack-signature") || req.headers.get("X-Paystack-Signature");
    // Verify signature using HMAC SHA512 with PAYSTACK_SECRET
    const encoder = new TextEncoder();
    const keyData = encoder.encode(PAYSTACK_SECRET);
    const cryptoKey = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-512" }, false, ["verify"]);
    const sigData = encoder.encode(text);
    const isValid = await crypto.subtle.verify("HMAC", cryptoKey, hexToUint8Array(sig || ""), sigData).catch(() => false);

    // NOTE: Some runtimes can't compare hex easily; if signature not present, you may trust payload (not ideal)
    // For safety, check event and reference in payload:
    const payload = JSON.parse(text);
    if (!isValid) {
      console.warn("Invalid paystack signature, ignoring");
      // continue but don't update DB; return 400
      return new Response("Invalid signature", { status: 400 });
    }

    // On successful transaction event
    if (payload.event === "charge.success" || payload.event === "transaction.success") {
      const data = payload.data;
      const refPaymentId = data?.metadata?.paymentId || extractPaymentIdFromReference(data?.reference);

      // fetch payment row
      const { data: paymentRow } = await supabase.from("payments").select("*").eq("id", refPaymentId).maybeSingle();

      // update payments table
      await supabase.from("payments").update({ status: "succeeded", provider_charge_id: data?.id || data?.reference }).eq("id", refPaymentId);

      // increment wish raised_amount
      if (paymentRow?.wish_id) {
        // Try RPC increment_wish_amount if exists, otherwise update
        try {
          await supabase.rpc("increment_wish_amount", { wish_uuid: paymentRow.wish_id, inc_amount: Number(paymentRow.amount) });
        } catch {
          await supabase.from("wishes").update({ raised_amount: (paymentRow?.amount || 0) + (paymentRow?.raised_amount || 0) }).eq("id", paymentRow.wish_id);
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err) {
    console.error("paystack webhook error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});

// helper: convert hex string to Uint8Array
function hexToUint8Array(hex) {
  if (!hex) return new Uint8Array();
  const arr = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) arr[i / 2] = parseInt(hex.substr(i, 2), 16);
  return arr;
}

// helper: fallback parse function
function extractPaymentIdFromReference(ref) {
  // if you encode payment id in ref during initialization, parse it here
  // e.g. ref like 'wish_{paymentId}_{ts}'
  if (!ref) return null;
  const m = ref.match(/wish_([0-9a-fA-F-]+)/);
  return m ? m[1] : null;
}
