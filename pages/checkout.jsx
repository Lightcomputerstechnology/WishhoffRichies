"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function CheckoutPage() {
  const router = useRouter();
  const [checkoutData, setCheckoutData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("checkoutData");
    if (stored) setCheckoutData(JSON.parse(stored));
    else router.push("/explore"); // If no data, go back
    setLoading(false);
  }, []);

  const handleConfirm = () => {
    if (!checkoutData?.checkout_url) return;
    window.location.href = checkoutData.checkout_url;
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500 dark:text-slate-300 animate-pulse">
          Preparing checkout…
        </p>
      </div>
    );

  if (!checkoutData)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">No donation data found.</p>
      </div>
    );

  return (
    <>
      <Head>
        <title>Checkout | LightTech</title>
      </Head>
      <Navbar />
      <main className="container mx-auto px-6 py-16 min-h-screen flex flex-col items-center">
        <section className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg w-full max-w-lg text-center space-y-4">
          <h1 className="text-3xl font-extrabold text-primary">Confirm Donation</h1>

          <p className="text-slate-600 dark:text-slate-300">
            You’re about to donate{" "}
            <strong>${checkoutData.amount}</strong> via{" "}
            <strong className="capitalize">{checkoutData.method}</strong>
          </p>

          {checkoutData.wishTitle && (
            <p className="text-slate-500 dark:text-slate-400">
              For: <strong>{checkoutData.wishTitle}</strong>
            </p>
          )}

          <div className="flex flex-col gap-3 mt-4">
            <button
              onClick={handleConfirm}
              className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary/90 transition"
            >
              Proceed to Payment
            </button>
            <button
              onClick={() => router.push("/explore")}
              className="w-full border border-slate-400 text-slate-700 dark:text-slate-200 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            >
              Cancel
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
