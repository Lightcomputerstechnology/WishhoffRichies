"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { supabase } from "../../lib/supabaseClient";

export default function DonatePage() {
  const router = useRouter();
  const { wishId } = router.query;

  const [wish, setWish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Load wish details
  useEffect(() => {
    if (!wishId) return;
    const fetchWish = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("wishes")
        .select("*")
        .eq("id", wishId)
        .single();
      if (error) console.error("Error fetching wish:", error);
      else setWish(data);
      setLoading(false);
    };
    fetchWish();
  }, [wishId]);

  // Handle donation
  const handleDonate = async () => {
    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid donation amount.");
      return;
    }
    setError("");
    setProcessing(true);

    try {
      // Call Supabase Edge Function: init-payment
      const { data, error } = await supabase.functions.invoke("init-payment", {
        body: {
          amount,
          method: paymentMethod,
          wishId,
        },
      });

      if (error) throw error;
      if (!data?.checkout_url) throw new Error("Invalid payment response.");

      // Redirect to payment gateway
      window.location.href = data.checkout_url;
    } catch (err) {
      console.error("Donation error:", err);
      setError("Failed to initiate donation. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500 dark:text-slate-400 animate-pulse">
          Loading wish…
        </p>
      </div>
    );

  if (!wish)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <p className="text-red-500 mb-4">Wish not found.</p>
        <Link href="/explore" className="text-primary hover:underline">
          Back to Explore
        </Link>
      </div>
    );

  return (
    <>
      <Head>
        <title>Donate — {wish.title}</title>
      </Head>

      <Navbar />

      <main className="container mx-auto px-6 py-16 min-h-screen flex flex-col items-center">
        <section className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg w-full max-w-xl flex flex-col gap-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary text-center">
            Donate to Make a Wish 💖
          </h1>

          <div className="text-center">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              {wish.title}
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Requested by: <strong>{wish.name}</strong>
            </p>
            <p className="text-slate-500 dark:text-slate-400">
              Goal: <strong>${wish.amount}</strong>
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium text-slate-700 dark:text-slate-200">
              Donation Amount ($)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`e.g. ${wish.amount}`}
              className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium text-slate-700 dark:text-slate-200">
              Choose Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-primary transition"
            >
              <option value="stripe">Stripe (International)</option>
              <option value="flutterwave">Flutterwave (Nigeria)</option>
              <option value="paystack">Paystack (Nigeria)</option>
            </select>
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && (
            <p className="text-green-500 text-center font-medium">
              Donation successful! Redirecting…
            </p>
          )}

          <button
            onClick={handleDonate}
            disabled={processing}
            className={`w-full py-3 rounded-lg font-semibold text-white transition ${
              processing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary hover:bg-primary/90"
            }`}
          >
            {processing ? "Processing..." : "Donate Now"}
          </button>
        </section>
      </main>

      <Footer />
    </>
  );
}