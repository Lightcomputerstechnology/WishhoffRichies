import { serve } from "std/server";
import { createClient } from "@supabase/supabase-js";

// ✅ Use Supabase-compatible environment variable names
const SERVICE_URL = Deno.env.get("SERVICE_URL")!; // instead of SUPABASE_URL
const SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY")!; // instead of SUPABASE_SERVICE_ROLE_KEY
const PAYSTACK_SECRET = Deno.env.get("PAYSTACK_SECRET")!;
const FLW_SECRET = Deno.env.get("FLW_SECRET")!;
const NOWPAYMENTS_KEY = Deno.env.get("NOWPAYMENTS_KEY")!;
const BASE_URL = Deno.env.get("BASE_URL") || "https://wishhoffrichies-fi38.onrender.com"; // instead of NEXT_PUBLIC_BASE_URL

// ✅ Initialize Supabase client
const supabase = createClient(SERVICE_URL, SERVICE_ROLE_KEY);

serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const body = await req.json();
    const { wishId, donor_name, donor_email, amount, method } = body;

    if (!wishId || !amount || !method) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    // ✅ 1. Verify wish exists
    const { data: wish, error: wishErr } = await supabase
      .from("wishes")
      .select("id, title, description")
      .eq("id", wishId)
      .maybeSingle();

    if (wishErr || !wish) {
      return new Response(JSON.stringify({ error: "Wish not found" }), { status: 404 });
    }

    const reference = `wish_${wishId}_${Date.now()}`;
    let redirect = "";

    // ✅ 2. Payment gateway logic
    if (method === "card" || method === "bank") {
      // 💳 Paystack
      const paystackResp = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
        },
        body: JSON.stringify({
          email: donor_email || "anonymous@wishhoff.com",
          amount: Math.round(Number(amount) * 100), // convert to kobo
          reference,
          callback_url: `${BASE_URL}/wish/${wishId}?status=success`,
          metadata: { paymentId: reference, wishId },
        }),
      });

      const paystackData = await paystackResp.json();
      if (!paystackResp.ok || !paystackData?.data?.authorization_url) {
        console.error("Paystack error:", paystackData);
        throw new Error("Failed to initialize Paystack payment");
      }
      redirect = paystackData.data.authorization_url;
    } 
    
    else if (method === "flutterwave") {
      // 🏦 Flutterwave
      const flwResp = await fetch("https://api.flutterwave.com/v3/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${FLW_SECRET}`,
        },
        body: JSON.stringify({
          tx_ref: reference,
          amount,
          currency: "NGN",
          redirect_url: `${BASE_URL}/wish/${wishId}?status=success`,
          customer: { email: donor_email || "anonymous@wishhoff.com", name: donor_name || "Guest" },
          meta: { paymentId: reference, wishId },
        }),
      });

      const flwData = await flwResp.json();
      if (!flwResp.ok || !flwData?.data?.link) {
        console.error("Flutterwave error:", flwData);
        throw new Error("Failed to initialize Flutterwave payment");
      }
      redirect = flwData.data.link;
    } 
    
    else if (method === "crypto") {
      // 🪙 NowPayments (Crypto)
      const npResp = await fetch("https://api.nowpayments.io/v1/invoice", {
        method: "POST",
        headers: {
          "x-api-key": NOWPAYMENTS_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price_amount: amount,
          price_currency: "USD",
          pay_currency: "USDT",
          order_id: reference,
          order_description: `Donation to "${wish.title}"`,
          success_url: `${BASE_URL}/wish/${wishId}?status=success`,
          cancel_url: `${BASE_URL}/wish/${wishId}?status=cancel`,
        }),
      });

      const npData = await npResp.json();
      if (!npResp.ok || !npData?.invoice_url) {
        console.error("NowPayments error:", npData);
        throw new Error("Failed to initialize crypto payment");
      }
      redirect = npData.invoice_url;
    } 
    
    else {
      return new Response(JSON.stringify({ error: "Unsupported payment method" }), { status: 400 });
    }

    // ✅ 3. Store payment record in database
    await supabase.from("payments").insert({
      id: reference,
      wish_id: wishId,
      donor_name,
      donor_email,
      amount,
      method,
      status: "pending",
      created_at: new Date().toISOString(),
    });

    // ✅ 4. Respond with redirect link
    return new Response(JSON.stringify({ redirect, reference }), { status: 200 });
  } catch (err) {
    console.error("💥 init-payment error:", err);
    return new Response(JSON.stringify({ error: err.message || "Internal server error" }), { status: 500 });
  }
});