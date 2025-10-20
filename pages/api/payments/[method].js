// pages/api/payments/[method].js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { wishId, donor_name, donor_email, amount, method } = req.body;
  if (!wishId || !donor_name || !donor_email || !amount || !method)
    return res.status(400).json({ error: "Missing required fields" });

  try {
    // 1️⃣ Get admin percentage
    const { data: setting } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "admin_percent")
      .single();

    const adminPercent = parseFloat(setting?.value || "10");
    const adminCut = (amount * adminPercent) / 100;
    const wishCut = amount - adminCut;

    // 2️⃣ Insert pending payment record
    const { data: payment, error: insertError } = await supabase
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

    if (insertError) throw insertError;

    // 3️⃣ Generate provider redirect
    let paymentUrl = null;

    /** PAYSTACK **/
    if (method === "paystack") {
      const init = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: donor_email,
          amount: Math.round(amount * 100),
          callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/wish/${wishId}?status=success`,
          metadata: { payment_id: payment.id, wish_id: wishId },
        }),
      });
      const payData = await init.json();
      paymentUrl = payData.data?.authorization_url;
    }

    /** FLUTTERWAVE **/
    else if (method === "flutterwave") {
      const init = await fetch("https://api.flutterwave.com/v3/payments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tx_ref: `wish_${payment.id}_${Date.now()}`,
          amount: amount,
          currency: "USD",
          redirect_url: `${process.env.NEXT_PUBLIC_SITE_URL}/wish/${wishId}?status=success`,
          customer: { email: donor_email, name: donor_name },
          meta: { wish_id: wishId, payment_id: payment.id },
        }),
      });
      const flwData = await init.json();
      paymentUrl = flwData.data?.link;
    }

    /** NOWPAYMENTS **/
    else if (method === "nowpayments") {
      const init = await fetch("https://api.nowpayments.io/v1/payment", {
        method: "POST",
        headers: {
          "x-api-key": process.env.NOWPAYMENTS_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price_amount: amount,
          price_currency: "usd",
          pay_currency: "btc", // or let user choose
          order_id: payment.id,
          order_description: `Donation for wish ${wishId}`,
          success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/wish/${wishId}?status=success`,
          cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/wish/${wishId}?status=cancel`,
        }),
      });
      const nowData = await init.json();
      paymentUrl = nowData.invoice_url;
    }

    if (!paymentUrl)
      return res.status(500).json({
        error: "Payment link not generated. Check provider API or keys.",
      });

    // ✅ Return payment and redirect URL
    return res.status(200).json({
      message: "Payment initialized successfully",
      payment,
      redirect: paymentUrl,
    });
  } catch (err) {
    console.error("Payment init error:", err);
    return res
      .status(500)
      .json({ error: "Payment initialization failed", details: err.message });
  }
}
