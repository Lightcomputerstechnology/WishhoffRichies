"use client";
import { useState } from "react";
import CurrencySelector from "./CurrencySelector";

/**
 * DonateButton:
 * - Opens modal for user to enter donation details.
 * - Supports Paystack, Flutterwave, and NowPayments (crypto).
 * - Calls your Next.js API routes dynamically based on payment method.
 */
export default function DonateButton({ wishId, wishTitle, amountTarget }) {
  const [open, setOpen] = useState(false);
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [method, setMethod] = useState("card"); // card / bank / crypto
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Helper: map UI method to backend API path + method name
  function getPaymentEndpoint(method) {
    if (method === "card") return "/api/payments/paystack";
    if (method === "bank") return "/api/payments/flutterwave";
    if (method === "crypto") return "/api/payments/nowpayments";
    return "/api/payments/paystack";
  }

  function mapMethodName(method) {
    if (method === "card") return "paystack";
    if (method === "bank") return "flutterwave";
    if (method === "crypto") return "nowpayments";
    return "paystack";
  }

  // Convert amount to USD (via exchangerate.host)
  async function convertToUSD(value, fromCurrency) {
    if (!value) return null;
    if (String(fromCurrency).toUpperCase() === "USD") return Number(value);
    try {
      const res = await fetch(
        `https://api.exchangerate.host/convert?from=${fromCurrency}&to=USD&amount=${value}`
      );
      const json = await res.json();
      if (json?.result) return Number(json.result);
    } catch (err) {
      console.warn("Currency conversion failed:", err);
    }
    // Fallback static rates
    const fallback = { NGN: 0.0024, EUR: 1.08, GBP: 1.25, USD: 1 };
    const rate = fallback[fromCurrency?.toUpperCase()] || 1;
    return Number(value) * rate;
  }

  // Initialize payment
  async function handleInit() {
    setError("");
    if (!donorName || !donorEmail || !amount) {
      setError("Please fill all fields.");
      return;
    }
    const numeric = Number(amount);
    if (isNaN(numeric) || numeric <= 0) {
      setError("Enter a valid amount.");
      return;
    }

    setLoading(true);
    try {
      const amountUsd = await convertToUSD(numeric, currency);
      if (!amountUsd) throw new Error("Conversion failed");

      const payload = {
        wishId,
        donor_name: donorName,
        donor_email: donorEmail,
        amount: Number(amountUsd.toFixed(2)),
        method: mapMethodName(method),
      };

      const endpoint = getPaymentEndpoint(method);
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await res.json();
      if (!res.ok) {
        console.error("init-payment failed", body);
        throw new Error(body.error || "Payment initialization failed");
      }

      // Redirect to payment gateway
      const redirectUrl =
        body.redirect_url ||
        body.redirect ||
        body.url ||
        body.paymentUrl ||
        body.data?.url;

      if (!redirectUrl) {
        alert("Payment initialized. Check your email for details.");
        setOpen(false);
      } else {
        window.location.href = redirectUrl;
      }
    } catch (err) {
      console.error("Donation init error:", err);
      setError(err.message || "Failed to initialize payment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition font-semibold"
      >
        Donate
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          ></div>

          <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6 z-60">
            <h3 className="text-lg font-bold mb-2">
              Donate to: {wishTitle || "Wish"}
            </h3>
            <p className="text-sm text-slate-500 mb-3">
              Target: ${amountTarget || "N/A"}
            </p>

            <input
              placeholder="Your name"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              className="w-full mb-2 p-2 border rounded bg-transparent"
            />
            <input
              placeholder="Your email"
              value={donorEmail}
              onChange={(e) => setDonorEmail(e.target.value)}
              className="w-full mb-2 p-2 border rounded bg-transparent"
            />

            <div className="flex gap-2 mb-2">
              <input
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 p-2 border rounded bg-transparent"
                type="number"
                min="1"
              />
              <CurrencySelector value={currency} onChange={setCurrency} />
            </div>

            <div className="flex gap-2 mb-3">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="flex-1 p-2 border rounded bg-transparent"
              >
                <option value="card">Debit / Credit Card (Paystack)</option>
                <option value="bank">Bank / Transfer (Flutterwave)</option>
                <option value="crypto">Crypto (NowPayments)</option>
              </select>
            </div>

            {error && (
              <div className="text-sm text-red-500 mb-2">{error}</div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleInit}
                disabled={loading}
                className="flex-1 py-2 rounded bg-primary text-white"
              >
                {loading ? "Processing..." : "Continue to Payment"}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="flex-1 py-2 rounded border"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
