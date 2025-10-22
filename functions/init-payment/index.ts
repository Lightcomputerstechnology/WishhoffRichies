// functions/init-payment/index.ts
import { serve } from "std/server";
import { createClient } from "@supabase/supabase-js";

// ✅ Use Supabase-safe variable names (no NEXT_PUBLIC_ or SUPABASE_ prefixes)
const SERVICE_URL = Deno.env.get("SERVICE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY")!;
const PAYSTACK_SECRET = Deno.env.get("PAYSTACK_SECRET")!;
const FLW_SECRET = Deno.env.get("FLW_SECRET")!;
const NOWPAYMENTS_KEY = Deno.env.get("NOWPAYMENTS_KEY")!;
const BASE_URL = Deno.env.get("BASE_URL")!; // e.g. https://wishhoffrichies-fi38.onrender.com

// ✅ Initialize Supabase client
const supabase = createClient(SERVICE_URL, SERVICE_ROLE_KEY);

serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
    }

    const body = await req.json();
    const { wishId, donor_name, donor_email, amount, method } = body;

    if (!wishId || !donor_name || !donor_email || !amount || !method) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    // 1️⃣ Get admin_percent from settings table
    const { data: setting } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "admin_percent")
      .single();

    const adminPercent = parseFloat(setting?.value ?? "10");
    const adminCut = Math.round((amount * adminPercent) / 100 * 100) / 100;
    const wishCut = Math.round((amount - adminCut) * 100) / 100;

    // 2️⃣ Create pending payment record
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
          wish_cut: wishCut,
        },
      ])
      .select()
      .single();

    if (insertErr) throw insertErr;

    // 3️⃣ Initialize payment
    let redirectUrl: string | null = null;

    // 💳 Paystack
    if (method === "card") {
      const psResp = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: donor_email,
          amount: Math.round(Number(amount) * 100),
          callback_url: `${BASE_URL}/success?source=paystack&paymentId=${payment.id}`,
          metadata: { wishId, paymentId: payment.id },
        }),
      });

      const psJson = await psResp.json();
      if (!psResp.ok) throw new Error(psJson.message || "Paystack init failed");
      redirectUrl = psJson.data.authorization_url;
    }

    // 🏦 Flutterwave
    else if (method === "bank") {
      const txRef = `wish_${payment.id}_${Date.now()}`;
      const flwResp = await fetch("https://api.flutterwave.com/v3/payments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${FLW_SECRET}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tx_ref: txRef,
          amount,
          currency: "USD",
          redirect_url: `${BASE_URL}/success?source=flutterwave&paymentId=${payment.id}`,
          customer: { email: donor_email, name: donor_name },
          meta: { wishId, paymentId: payment.id },
        }),
      });

      const flwJson = await flwResp.json();
      if (!flwResp.ok) throw new Error(flwJson.message || "Flutterwave init failed");
      redirectUrl = flwJson.data.link;
    }

    // 🪙 NowPayments (Crypto)
    else if (method === "crypto") {
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
          success_url: `${BASE_URL}/success?source=nowpayments&paymentId=${payment.id}`,
          cancel_url: `${BASE_URL}/cancel?paymentId=${payment.id}`,
        }),
      });

      const npJson = await npResp.json();
      if (!npResp.ok) throw new Error(npJson.message || "NowPayments init failed");
      redirectUrl = npJson.invoice_url || npJson.data?.url;
    }

    // 4️⃣ Return result
    if (!redirectUrl) {
      return new Response(
        JSON.stringify({ payment, message: "Payment created but no redirect URL" }),
        { status: 200 }
      );
    }

    return new Response(JSON.stringify({ redirect: redirectUrl, payment }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("init-payment error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "init failed" }),
      { status: 500 }
    );
  }
});