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
  const [paymentMethod, setPaymentMethod] = useState("flutterwave");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [isGuest, setIsGuest] = useState(true);

  // Load wish details if available
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsGuest(!user);
    };
    checkUser();

    const fetchWish = async () => {
      if (!wishId) {
        setLoading(false);
        return;
      }
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
      // Pick correct Supabase Edge Function
      let fnName;
      switch (paymentMethod) {
        case "flutterwave":
          fnName = "init-flutterwave-payment";
          break;
        case "paystack":
          fnName = "init-paystack-payment";
          break;
        case "nowpayments":
          fnName = "init-nowpayment";
          break;
        default:
          throw new Error("Unsupported payment method");
      }

      const { data, error } = await supabase.functions.invoke(fnName, {
        body: {
          amount,
          wishId: wish?.id || null,
          userMode: isGuest ? "guest" : "registered",
        },
      });

      if (error) throw error;
      if (!data?.checkout_url) throw new Error("Invalid payment response.");

      // Redirect to payment page
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
          Loading donation details…
        </p>
      </div>
    );

  return (
    <>
      <Head>
        <title>Donate | LightTech</title>
      </Head>

      <Navbar />

      <main className="container mx-auto px-6 py-16 min-h-screen flex flex-col items-center">
        <section className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg w-full max-w-xl flex flex-col gap-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary text-center">
            Make a Donation 💖
          </h1>

          {wish ? (
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
          ) : (
            <p className="text-center text-slate-500">
              Guest donation — supporting community projects ❤️
            </p>
          )}

          {/* Donation form */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-slate-700 dark:text-slate-200">
              Donation Amount ($)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
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
              <option value="flutterwave">Flutterwave (Nigeria)</option>
              <option value="paystack">Paystack (Nigeria)</option>
              <option value="nowpayments">NowPayments (Crypto)</option>
            </select>
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}

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

          <p className="text-xs text-center text-slate-400 mt-3">
            {isGuest
              ? "You're donating as a guest. You can sign up later to track your impact."
              : "Thank you for being part of our giving community!"}
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}
