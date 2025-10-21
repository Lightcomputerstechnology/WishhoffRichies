"use client";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { supabase } from "../../lib/supabaseClient";

export default function WishPage() {
  const router = useRouter();
  const { id } = router.query;
  const [wish, setWish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [donorEmail, setDonorEmail] = useState("");
  const [donating, setDonating] = useState(false);
  const [user, setUser] = useState(null);

  // ✅ Load wish details
  useEffect(() => {
    if (!id) return;
    let mounted = true;

    async function loadWish() {
      try {
        const { data, error } = await supabase
          .from("wishes")
          .select("*")
          .eq("id", id)
          .single();
        if (error) throw error;
        if (mounted) setWish(data);
      } catch (err) {
        console.error("Error loading wish:", err);
        if (mounted) setWish(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadWish();

    // ✅ Load current user if logged in
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setUser(data.user);
    });

    return () => {
      mounted = false;
    };
  }, [id]);

  // ✅ Start donation process
  async function startDonate(amount, donorType = "user") {
    if (!donorEmail && donorType === "user") {
      return alert("Please enter your email before donating.");
    }

    setDonating(true);

    try {
      const res = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wishId: id,
          donorEmail: donorEmail || "anonymous@wishhoff.com",
          amount,
          paymentMethod: "paystack", // default; can be chosen dynamically later
          donorType,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to initialize payment.");

      // ✅ Store temporary data in localStorage for /checkout page
      localStorage.setItem(
        "checkoutData",
        JSON.stringify({
          amount,
          method: "paystack",
          wishTitle: wish.title,
          checkout_url: data.checkout_url,
        })
      );

      // ✅ Redirect to checkout
      router.push(`/checkout?guest=${donorType === "guest"}`);
    } catch (err) {
      console.error(err);
      alert(err.message || "Payment initialization failed.");
    } finally {
      setDonating(false);
    }
  }

  const handleGuestDonate = () => {
    router.push(`/choose-donation-flow?id=${id}`);
  };

  return (
    <>
      <Head>
        <title>{wish ? wish.title : "Wish"} — WishhoffRichies</title>
      </Head>
      <Navbar />

      <main className="min-h-screen bg-slate-50 dark:bg-slate-900 py-10 px-4">
        {loading ? (
          <p className="text-center text-lg text-slate-700 dark:text-slate-200">
            Loading wish details…
          </p>
        ) : !wish ? (
          <p className="text-center text-lg text-red-600 dark:text-red-400">
            Wish not found.
          </p>
        ) : (
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
            {/* Wish Details */}
            <section className="flex-1 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                {wish.title}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Requested by: {wish.name || "Anonymous"} • Location:{" "}
                {wish.location || "Unknown"}
              </p>
              <p className="text-slate-700 dark:text-slate-200 mb-4 leading-relaxed">
                {wish.description}
              </p>

              <div className="bg-slate-100 dark:bg-slate-700 rounded-full h-4 overflow-hidden mb-4">
                <div
                  className="bg-primary h-4 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      (wish.raised_amount / wish.amount) * 100 || 0,
                      100
                    )}%`,
                  }}
                ></div>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300">
                ${wish.raised_amount || 0} raised of ${wish.amount}
              </p>
            </section>

            {/* Donation Card */}
            <aside className="w-full md:w-80 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Support this wish
              </h3>

              {!user && (
                <>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    className="w-full p-3 mb-4 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                </>
              )}

              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Choose Amount
              </label>
              <div className="flex flex-wrap gap-2 mb-4">
                {[5, 10, 25, 50, Number(wish.amount || 0)].map((a) => (
                  <button
                    key={a}
                    onClick={() => startDonate(a, user ? "user" : "guest")}
                    disabled={donating}
                    className="flex-1 py-2 px-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {donating ? "Processing…" : `$${a}`}
                  </button>
                ))}
              </div>

              {!user && (
                <div className="text-center mt-4">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                    Or choose your flow:
                  </p>
                  <button
                    onClick={handleGuestDonate}
                    className="text-primary hover:underline text-sm font-medium"
                  >
                    💫 Donate as Guest / Login to Donate
                  </button>
                </div>
              )}
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
