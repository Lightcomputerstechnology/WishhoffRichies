"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { supabase } from "../../lib/supabaseClient";
import { generateMockWishes } from "../../lib/mockWishes";

export default function DonatePage() {
  const router = useRouter();
  const { id, mock } = router.query;

  const [wish, setWish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("flutterwave");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [isGuest, setIsGuest] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsGuest(!user);

      if (!id) return setLoading(false);

      // Always check if explicitly marked as mock
      if (mock === "1") {
        const mockWish = generateMockWishes().find((w) => w.id === id);
        if (mockWish) {
          mockWish.isMock = true;
          setWish(mockWish);
          setLoading(false);
          return;
        }
      }

      // Try fetching from Supabase first
      const { data, error } = await supabase
        .from("wishes")
        .select("*")
        .eq("id", id)
        .single();

      if (!data || error) {
        // fallback to mock if missing
        const mockWish = generateMockWishes().find((w) => w.id === id);
        if (mockWish) {
          mockWish.isMock = true;
          setWish(mockWish);
        }
      } else {
        setWish(data);
      }

      setLoading(false);
    };

    init();
  }, [id, mock]);

  const handleDonate = async () => {
    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid donation amount.");
      return;
    }
    setError("");
    setProcessing(true);

    try {
      // ⚙️ If this is a mock wish — simulate success
      if (wish?.isMock) {
        await new Promise((r) => setTimeout(r, 1500));
        router.push("/donate/success?mock=1");
        return;
      }

      // ✅ Otherwise invoke payment function
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
          isMock: wish?.isMock || false,
        },
      });

      if (error) throw error;
      if (!data?.checkout_url) throw new Error("Invalid payment response.");

      window.location.href = data.checkout_url;
    } catch (err) {
      console.error(err);
      const message = err.message.includes("timeout")
        ? "Connection timeout. Please try again."
        : err.message.includes("Unsupported")
        ? "Invalid payment method selected."
        : "Failed to initiate donation. Please try again.";
      setError(message);
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
        <title>
          {wish ? `Donate to ${wish.title} | LightTech` : "Donate | LightTech"}
        </title>
        <meta
          name="description"
          content="Support wishes and dreams through LightTech's donation platform. Make a positive impact today."
        />
        <meta property="og:title" content="LightTech Donations" />
        <meta
          property="og:description"
          content="Empowering change, one donation at a time."
        />
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
                Requested by: <strong>{wish.name || "Anonymous"}</strong>
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

          <div className="flex flex-col gap-2">
            <label
              htmlFor="amount"
              className="font-medium text-slate-700 dark:text-slate-200"
            >
              Donation Amount ($)
            </label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="payment-method"
              className="font-medium text-slate-700 dark:text-slate-200"
            >
              Choose Payment Method
            </label>
            <select
              id="payment-method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-primary transition"
            >
              <option value="flutterwave">Flutterwave (Nigeria)</option>
              <option value="paystack">Paystack (Nigeria)</option>
              <option value="nowpayments">NowPayments (Crypto)</option>
            </select>
          </div>

          {error && (
            <p className="text-red-500 text-center font-medium">{error}</p>
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
