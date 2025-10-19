// pages/wish/[id].js
"use client";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function WishPage() {
  const router = useRouter();
  const { id } = router.query;
  const [wish, setWish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [donorEmail, setDonorEmail] = useState("");
  const [donating, setDonating] = useState(false);

  useEffect(() => {
    if (!id) return;
    let mounted = true;

    async function load() {
      try {
        const res = await fetch(`/api/wishes/list`);
        const data = await res.json();
        if (!mounted) return;
        const found = data.find((x) => String(x.id) === String(id));
        setWish(found || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => (mounted = false);
  }, [id]);

  async function startDonate(amount) {
    if (!donorEmail) return alert("Please enter your email");
    setDonating(true);
    try {
      const res = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wishId: id, amount, donorEmail }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else throw new Error(data.error || "Unable to create checkout");
    } catch (err) {
      alert(err.message);
    } finally {
      setDonating(false);
    }
  }

  return (
    <>
      <Head>
        <title>{wish ? wish.title : "Wish"} — WishhoffRichies</title>
      </Head>
      <Navbar />

      <main className="min-h-screen bg-slate-50 dark:bg-slate-900 py-10 px-4">
        {loading ? (
          <p className="text-center text-lg">Loading…</p>
        ) : !wish ? (
          <p className="text-center text-lg text-red-600 dark:text-red-400">Wish not found.</p>
        ) : (
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
            {/* Wish details */}
            <section className="flex-1 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                {wish.title}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Requested by: {wish.name || "Anonymous"}
              </p>
              <p className="text-slate-700 dark:text-slate-200 mb-4">{wish.description}</p>

              <div className="bg-slate-100 dark:bg-slate-700 rounded-full h-4 overflow-hidden mb-4">
                <div
                  className="bg-primary h-4 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min((wish.raised_amount / wish.amount) * 100 || 0, 100)}%`,
                  }}
                ></div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                ${wish.raised_amount || 0} raised of ${wish.amount}
              </p>
            </section>

            {/* Donation card */}
            <aside className="w-full md:w-80 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Support this wish
              </h3>
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

              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Choose Amount
              </label>
              <div className="flex flex-wrap gap-2 mb-4">
                {[5, 10, 25, 50, Number(wish.amount || 0)].map((a) => (
                  <button
                    key={a}
                    onClick={() => startDonate(a)}
                    disabled={donating}
                    className="flex-1 py-2 px-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {donating ? "Processing…" : `$${a}`}
                  </button>
                ))}
              </div>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
