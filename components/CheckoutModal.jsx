// components/CheckoutModal.jsx
"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function CheckoutModal({ wish, onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState(wish?.amount || "");
  const [method, setMethod] = useState("card"); // default
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!name.trim()) return "Please enter your name";
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) return "Please enter a valid email";
    if (!amount || Number(amount) <= 0) return "Please enter a valid donation amount";
    if (!method) return "Please pick a payment method";
    return null;
  };

  async function handleContinue(e) {
    e?.preventDefault();
    const err = validate();
    if (err) return toast.error(err);

    setLoading(true);
    try {
      // calls server API route which will init payment (Paystack/Flutterwave/NowPayments or your supabase function)
      const res = await fetch("/api/payments/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wishId: wish.id,
          donor_name: name,
          donor_email: email,
          amount: Number(amount),
          method, // "card" | "bank" | "crypto" - server maps to provider
        }),
      });

      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Payment init failed");

      // expected response { redirect, payment }
      if (body.redirect) {
        // redirect donor to provider checkout page
        window.location.href = body.redirect;
        return;
      }

      // fallback: if no redirect, show success / details
      toast.success(body.message || "Payment initialized");
      onClose?.();
    } catch (err) {
      console.error("init pay error:", err);
      toast.error(err.message || "Failed to initialize payment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => !loading && onClose?.()}
      />
      <div className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 z-10">
        <h3 className="text-lg font-semibold mb-2">Donate to: {wish.title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{wish.description}</p>

        <form onSubmit={handleContinue} className="space-y-3">
          <input
            className="w-full px-3 py-2 rounded border dark:bg-slate-700"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
          <input
            className="w-full px-3 py-2 rounded border dark:bg-slate-700"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <div className="flex gap-2">
            <input
              className="flex-1 px-3 py-2 rounded border dark:bg-slate-700"
              placeholder="Amount (USD)"
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={loading}
            />
            <select
              className="w-32 px-2 py-2 rounded border dark:bg-slate-700"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              disabled={loading}
            >
              <option value="card">Card</option>
              <option value="bank">Bank/Transfer</option>
              <option value="crypto">Crypto</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-white py-2 rounded-lg font-semibold hover:opacity-95"
            >
              {loading ? "Processing..." : "Continue to Payment"}
            </button>
            <button
              type="button"
              onClick={() => !loading && onClose?.()}
              className="px-4 py-2 rounded-lg border"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
