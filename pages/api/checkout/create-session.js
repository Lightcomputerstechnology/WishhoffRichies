// pages/api/checkout/create-session.js
import axios from "axios";
import { supabaseAdmin } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const {
    wishId,
    amount,
    currency = "NGN",
    donorEmail,
    paymentMethod = "paystack",
    donorType = "user", // 👈 "user" | "guest"
  } = req.body;

  if (!wishId || !amount) {
    return res
      .status(400)
      .json({ error: "Missing required fields: wishId or amount" });
  }

  try {
    // ✅ 1. Verify that the wish exists
    const { data: wish, error: wishError } = await supabaseAdmin()
      .from("wishes")
      .select("id, title")
      .eq("id", wishId)
      .single();

    if (wishError || !wish) {
      return res.status(404).json({ error: "Wish not found" });
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://wishhoffrichies.onrender.com";

    let paymentUrl = "";
    const reference = `WISH-${wishId}-${Date.now()}`;

    // ✅ 2. Payment Gateway selection
    if (paymentMethod === "paystack") {
      const response = await axios.post(
        "https://api.paystack.co/transaction/initialize",
        {
          email: donorEmail || "anonymous@wishhoff.com",
          amount: Math.round(Number(amount) * 100),
          currency,
          reference,
          callback_url: `${siteUrl}/wish/${wishId}?status=success`,
          metadata: { wish_id: wishId, donor_type: donorType },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      paymentUrl = response.data.data.authorization_url;
    } else if (paymentMethod === "flutterwave") {
      const response = await axios.post(
        "https://api.flutterwave.com/v3/payments",
        {
          tx_ref: reference,
          amount,
          currency,
          redirect_url: `${siteUrl}/wish/${wishId}?status=success`,
          customer: { email: donorEmail || "anonymous@wishhoff.com" },
          meta: { wish_id: wishId, donor_type: donorType },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      paymentUrl = response.data.data.link;
    } else if (paymentMethod === "nowpay") {
      const response = await axios.post(
        "https://api.nowpayments.io/v1/invoice",
        {
          price_amount: amount,
          price_currency: currency,
          pay_currency: "USDT",
          order_id: reference,
          order_description: `Donation to "${wish.title}"`,
          success_url: `${siteUrl}/wish/${wishId}?status=success`,
          cancel_url: `${siteUrl}/wish/${wishId}?status=cancel`,
        },
        {
          headers: {
            "x-api-key": process.env.NOWPAY_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );
      paymentUrl = response.data.invoice_url;
    } else {
      return res.status(400).json({ error: "Invalid payment method" });
    }

    // ✅ 3. Log payment
    await supabaseAdmin()
      .from("payments")
      .insert([
        {
          user_email: donorEmail,
          wish_id: wishId,
          method: paymentMethod,
          amount,
          currency,
          status: "pending",
          reference,
          donor_type: donorType, // 👈 add this column
        },
      ]);

    return res.status(200).json({ checkout_url: paymentUrl, reference });
  } catch (err) {
    console.error("Payment Session Error:", err.response?.data || err.message);
    return res.status(500).json({
      error: "Failed to create payment session",
      details: err.response?.data || err.message,
    });
  }
}
