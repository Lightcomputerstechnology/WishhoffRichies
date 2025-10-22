import { supabaseAdmin } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { wishId, donor_name, donor_email, amount, method, guest, user_id } = req.body;

  if (!wishId || !donor_name || !donor_email || !amount || !method) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const supportedMethods = ["paystack", "flutterwave", "nowpayments"];
  if (!supportedMethods.includes(method)) {
    return res.status(400).json({ error: "Unsupported payment method" });
  }

  try {
    const supabase = supabaseAdmin;

    // 1️⃣ Fetch admin percent
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
          guest: guest ? true : false,
          user_id: guest ? null : user_id || null,
        },
      ])
      .select()
      .single();

    if (insertError) throw insertError;

    // 3️⃣ Base URL
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.SITE_URL ||
      "http://localhost:3000";

    let redirectUrl = null;

    // ✅ PAYSTACK
    if (method === "paystack") {
      const resp = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: donor_email,
          amount: Math.round(Number(amount) * 100),
          callback_url: `${baseUrl}/success?source=paystack&paymentId=${payment.id}`,
          metadata: { wishId, paymentId: payment.id },
        }),
      });

      const data = await resp.json();
      if (!resp.ok || !data?.data?.authorization_url)
        throw new Error(data?.message || "Paystack initialization failed");

      redirectUrl = data.data.authorization_url;
    }

    // ✅ FLUTTERWAVE
    else if (method === "flutterwave") {
      const tx_ref = `wish_${payment.id}_${Date.now()}`;

      const resp = await fetch("https://api.flutterwave.com/v3/payments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tx_ref,
          amount,
          currency: "USD",
          redirect_url: `${baseUrl}/success?source=flutterwave&paymentId=${payment.id}`,
          customer: { email: donor_email, name: donor_name },
          meta: { wishId, paymentId: payment.id },
        }),
      });

      const data = await resp.json();
      if (!resp.ok || !data?.data?.link)
        throw new Error(data?.message || "Flutterwave initialization failed");

      redirectUrl = data.data.link;
    }

    // ✅ NOWPAYMENTS
    else if (method === "nowpayments") {
      const resp = await fetch("https://api.nowpayments.io/v1/invoice", {
        method: "POST",
        headers: {
          "x-api-key": process.env.NOWPAYMENTS_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price_amount: amount,
          price_currency: "usd",
          pay_currency: "usdt",
          order_id: payment.id,
          order_description: "Donation for wish",
          success_url: `${baseUrl}/success?source=nowpayments&paymentId=${payment.id}`,
          cancel_url: `${baseUrl}/cancel?paymentId=${payment.id}`,
        }),
      });

      const data = await resp.json();
      if (!resp.ok || !data?.invoice_url)
        throw new Error(data?.message || "NowPayments initialization failed");

      redirectUrl = data.invoice_url || data.data?.url;
    }

    // ✅ Return
    if (!redirectUrl) throw new Error("No redirect URL from provider");

    return res.status(200).json({
      redirect: redirectUrl,
      payment_id: payment.id,
      message: "Payment initialized successfully",
    });
  } catch (err) {
    console.error("💥 Payment Init Error:", err);
    return res.status(500).json({
      error: err.message || "Payment initialization failed",
    });
  }
}