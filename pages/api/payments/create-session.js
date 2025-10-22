// pages/api/payments/create-session.js
import axios from "axios";
import { createClient } from "@supabase/supabase-js";

// ✅ Create admin client with your current environment variable naming
const supabaseAdmin = createClient(
  process.env.SERVICE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const {
    wishId,
    amount,
    currency = "USD",
    donorEmail,
    donorName,
    paymentMethod = "card", // "card" | "bank" | "crypto"
  } = req.body;

  if (!wishId || !amount) {
    return res.status(400).json({ error: "Missing required fields: wishId or amount" });
  }

  try {
    // ✅ Verify that the wish exists
    const { data: wish, error: wishError } = await supabaseAdmin
      .from("wishes")
      .select("id, title")
      .eq("id", wishId)
      .single();

    if (wishError || !wish) {
      return res.status(404).json({ error: "Wish not found" });
    }

    const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://wishhoffrichies-fi38.onrender.com";
    const reference = `wish_${wishId}_${Date.now()}`;
    let paymentUrl = "";

    // ✅ Paystack (Card)
    if (paymentMethod === "card") {
      const response = await axios.post(
        "https://api.paystack.co/transaction/initialize",
        {
          email: donorEmail || "anonymous@wishhoff.com",
          amount: Math.round(Number(amount) * 100),
          currency,
          reference,
          callback_url: `${siteUrl}/success?source=paystack&wishId=${wishId}`,
          metadata: { wishId },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.data?.data?.authorization_url) {
        throw new Error(response.data?.message || "Paystack init failed");
      }
      paymentUrl = response.data.data.authorization_url;
    }

    // ✅ Flutterwave (Bank)
    else if (paymentMethod === "bank") {
      const response = await axios.post(
        "https://api.flutterwave.com/v3/payments",
        {
          tx_ref: reference,
          amount,
          currency,
          redirect_url: `${siteUrl}/success?source=flutterwave&wishId=${wishId}`,
          customer: { email: donorEmail || "anonymous@wishhoff.com", name: donorName },
          meta: { wishId },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.FLW_SECRET}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.data?.data?.link) {
        throw new Error(response.data?.message || "Flutterwave init failed");
      }
      paymentUrl = response.data.data.link;
    }

    // ✅ NowPayments (Crypto)
    else if (paymentMethod === "crypto") {
      const response = await axios.post(
        "https://api.nowpayments.io/v1/invoice",
        {
          price_amount: amount,
          price_currency: "usd",
          pay_currency: "usdt",
          order_id: reference,
          order_description: `Donation to "${wish.title}"`,
          success_url: `${siteUrl}/success?source=nowpayments&wishId=${wishId}`,
          cancel_url: `${siteUrl}/cancel?wishId=${wishId}`,
        },
        {
          headers: {
            "x-api-key": process.env.NOWPAYMENTS_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.data?.invoice_url) {
        throw new Error(response.data?.message || "NowPayments init failed");
      }
      paymentUrl = response.data.invoice_url;
    }

    // ✅ Save payment record in Supabase
    await supabaseAdmin
      .from("payments")
      .insert([
        {
          wish_id: wishId,
          donor_name: donorName,
          donor_email: donorEmail,
          method: paymentMethod,
          amount,
          currency,
          status: "pending",
          provider_reference: reference,
        },
      ]);

    // ✅ Respond with redirect link
    return res.status(200).json({ redirect: paymentUrl, reference });
  } catch (err) {
    console.error("💥 Payment Session Error:", err.response?.data || err.message);
    return res.status(500).json({
      error: "Failed to create payment session",
      details: err.response?.data || err.message,
    });
  }
}
