// functions/init-payment/index.ts
import { serve } from "std/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE")!;
const PAYSTACK_SECRET = Deno.env.get("PAYSTACK_SECRET")!;
const FLW_SECRET = Deno.env.get("FLW_SECRET")!;
const NOWPAYMENTS_KEY = Deno.env.get("NOWPAYMENTS_KEY")!;
const BASE_URL = Deno.env.get("NEXT_PUBLIC_BASE_URL")!; // e.g. https://wishhoffrichies-fi38.onrender.com

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

serve(async (req) => {
  try {
    if (req.method !== "POST") return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });

    const body = await req.json();
    const { wishId, donor_name, donor_email, amount, method } = body;

    if (!wishId || !donor_name || !donor_email || !amount || !method) {
      return new Response(JSON.stringify({ error: "missing fields" }), { status: 400 });
    }

    // 1) read admin_percent from settings
    const { data: setting, error: sErr } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "admin_percent")
      .single();

    if (sErr) console.warn("No admin_percent setting or error:", sErr);

    const adminPercent = parseFloat(setting?.value ?? "10"); // fallback 10%
    const adminCut = Math.round((amount * adminPercent) * 100) / 10000; // careful: amount likely in decimal; we'll store adminCut as same currency decimals
    const wishCut = Math.round((amount - adminCut) * 100) / 100;

    // 2) create payments record (pending)
    const { data: payment, error: insertErr } = await supabase
      .from("payments")
      .insert([
        {
          wish_id: wishId,
          donor_name,
          donor_email,
          amount,
          currency: "USD",
          method,
          status: "pending",
          admin_cut: adminCut,
          wish_cut: wishCut
        },
      ])
      .select()
      .single();

    if (insertErr) throw insertErr;

    // 3) initialize provider-specific payment and return redirect URL
    let redirectUrl = null;

    // --- Paystack (Card) initialization ---
    if (method === "card") {
      // Paystack initialize
      const psResp = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: donor_email,
          amount: Math.round(Number(amount) * 100), // kobo
          callback_url: `${BASE_URL}/payment/success?source=paystack&paymentId=${payment.id}`,
          metadata: { wishId, paymentId: payment.id },
        }),
      });
      const psJson = await psResp.json();
      if (!psResp.ok) throw new Error(psJson.message || "Paystack init failed");
      redirectUrl = psJson.data.authorization_url;
    }

    // --- Flutterwave (Bank Transfer / multiple methods) ---
    else if (method === "bank") {
      // Flutterwave v3 payment create
      const txRef = `wish_${payment.id}_${Date.now()}`;
      const flwResp = await fetch("https://api.flutterwave.com/v3/payments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${FLW_SECRET}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tx_ref: txRef,
          amount: amount,
          currency: "USD",
          redirect_url: `${BASE_URL}/payment/success?source=flutterwave&paymentId=${payment.id}`,
          customer: { email: donor_email, name: donor_name },
          meta: { wishId, paymentId: payment.id },
        }),
      });
      const flwJson = await flwResp.json();
      if (!flwResp.ok) throw new Error(flwJson.message || "Flutterwave init failed");
      redirectUrl = flwJson.data.link;
    }

    // --- NowPayments (Crypto) ---
    else if (method === "crypto") {
      // NowPayments (create invoice/charge)
      const npResp = await fetch("https://api.nowpayments.io/v1/invoice", {
        method: "POST",
        headers: {
          "x-api-key": NOWPAYMENTS_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price_amount: amount,
          price_currency: "usd",
          pay_currency: "usdt",
          order_id: `${payment.id}`,
          order_description: "Donation for wish",
          success_url: `${BASE_URL}/payment/success?source=nowpayments&paymentId=${payment.id}`,
          cancel_url: `${BASE_URL}/payment/cancel?paymentId=${payment.id}`,
        }),
      });
      const npJson = await npResp.json();
      if (!npResp.ok) throw new Error(npJson.message || "NowPayments init failed");
      redirectUrl = npJson.invoice_url || npJson.data?.url;
    }

    // If no valid gateway matched
    if (!redirectUrl) {
      return new Response(JSON.stringify({ payment, message: "No redirect url created" }), { status: 200 });
    }

    return new Response(JSON.stringify({ payment, redirect: redirectUrl }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("init-payment error:", err);
    return new Response(JSON.stringify({ error: err.message || "init failed" }), { status: 500 });
  }
});
