import { supabaseAdmin } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { wishId, donor_name, donor_email, amount, method } = req.body;

  if (!wishId || !donor_name || !donor_email || !amount || !method) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const supabase = supabaseAdmin();

    // 1️⃣ Get admin percentage (fallback to 10%)
    const { data: setting } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "admin_percent")
      .single();

    const adminPercent = parseFloat(setting?.value || "10");
    const adminCut = parseFloat(((amount * adminPercent) / 100).toFixed(2));
    const wishCut = parseFloat((amount - adminCut).toFixed(2));

    // 2️⃣ Insert payment record
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

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://wishhoffrichies.onrender.com";

    let paymentUrl = null;

    // ✅ PAYSTACK (Card)
    if (method === "paystack") {
      const init = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: donor_email,
          amount: Math.round(Number(amount) * 100), // Convert to kobo
          callback_url: `${baseUrl}/wish/${wishId}?status=success`,
          metadata: { payment_id: payment.id, wish_id: wishId },
        }),
      });

      const payData = await init.json();
      if (!init.ok || !payData?.data?.authorization_url) {
        throw new Error(payData?.message || "Paystack init failed");
      }

      paymentUrl = payData.data.authorization_url;
    }

    // ✅ FLUTTERWAVE (Bank / Card / Mobile Money)
    else if (method === "flutterwave") {
      const tx_ref = `wish_${payment.id}_${Date.now()}`;

      const init = await fetch("https://api.flutterwave.com/v4/payments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tx_ref,
          amount,
          currency: "USD",
          redirect_url: `${baseUrl}/wish/${wishId}?status=success`,
          customer: { email: donor_email, name: donor_name },
          meta: { wish_id: wishId, payment_id: payment.id },
        }),
      });

      const flwData = await init.json();
      if (!init.ok || !flwData?.data?.link) {
        throw new Error(flwData?.message || "Flutterwave init failed");
      }

      paymentUrl = flwData.data.link;
    }

    // ✅ NOWPAYMENTS (Crypto)
    else if (method === "nowpayments") {
      const init = await fetch("https://api.nowpayments.io/v1/invoice", {
        method: "POST",
        headers: {
          "x-api-key": process.env.NOWPAY_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price_amount: amount,
          price_currency: "usd",
          pay_currency: "usdt",
          order_id: payment.id,
          order_description: `Donation for wish ${wishId}`,
          success_url: `${baseUrl}/wish/${wishId}?status=success`,
          cancel_url: `${baseUrl}/wish/${wishId}?status=cancel`,
        }),
      });

      const nowData = await init.json();
      if (!init.ok || !nowData?.invoice_url) {
        throw new Error(nowData?.message || "NowPayments init failed");
      }

      paymentUrl = nowData.invoice_url;
    }

    if (!paymentUrl) {
      throw new Error("Payment link not generated. Check provider API or keys.");
    }

    // ✅ Return response
    return res.status(200).json({
      status: "success",
      message: "Payment initialized successfully",
      payment_id: payment.id,
      redirect_url: paymentUrl,
    });
  } catch (err) {
    console.error("💥 Payment Init Error:", err);
    return res.status(500).json({
      error: "Payment initialization failed",
      details: err.message,
    });
  }
}
