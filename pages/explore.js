"use client";

import Link from "next/link";
import Head from "next/head";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WishCard from "../components/WishCard";
import { supabase } from "../lib/supabaseClient";

// ✅ Exact 20 mocks for fallback
const generateMockWishes = () => [ /* ... keep your 20 mocks unchanged ... */ ];

export default function Explore() {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let mounted = true;
    async function loadWishes() {
      try {
        const { data, error } = await supabase
          .from("wishes")
          .select("*")
          .order("created_at", { ascending: false });

        if (!mounted) return;

        if (error || !data || data.length === 0) {
          console.warn("⚠️ Using mock data:", error?.message);
          setWishes(generateMockWishes());
        } else {
          setWishes(
            data.map((r) => ({
              id: r.id,
              name: r.name || r.user_name || r.requester_name,
              title: r.title,
              description: r.description,
              amount: r.amount || r.amount_target || r.target_amount,
              raised: r.raised_amount || r.raised || 0,
              verified: !!r.verified,
              image: r.image_url || "/sample1.jpg",
              location: r.location || "Unknown",
              created_at: r.created_at,
            }))
          );
        }
      } catch (err) {
        console.error("❌ Failed to load wishes:", err);
        setWishes(generateMockWishes());
      } finally {
        setLoading(false);
      }
    }

    loadWishes();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = wishes.filter(
    (w) =>
      w.title?.toLowerCase().includes(query.toLowerCase()) ||
      w.description?.toLowerCase().includes(query.toLowerCase()) ||
      w.name?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>Explore Wishes — WishhoffRichies</title>
        <meta
          name="description"
          content="Discover verified wishes from real people and help make them come true."
        />
      </Head>

      <Navbar />

      <main className="min-h-screen px-6 py-20 bg-gradient-to-b from-[#f8fafc] to-[#e2e8f0] dark:from-slate-900 dark:to-slate-800">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold text-primary mb-4">
            Explore Wishes 💫
          </h1>
          <p className="text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-6 text-lg">
            Scroll through heartfelt wishes and discover people whose dreams you
            can help bring to life.
          </p>

          <div className="flex justify-center">
            <input
              type="text"
              placeholder="🔍 Search wishes..."
              className="w-full max-w-lg px-5 py-3 rounded-lg border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none transition"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </section>

        {/* Wishes Grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <p className="text-slate-500 dark:text-slate-400 animate-pulse">
              Loading wishes…
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              No wishes match your search — be the first to make one!
            </p>
            <Link
              href="/make-wish"
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
            >
              ✨ Make a Wish
            </Link>
          </div>
        ) : (
          <>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((wish) => (
                <div key={wish.id} className="animate-fade-up">
                  <WishCard wish={wish} />
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <button className="px-6 py-3 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition">
                Load More
              </button>
            </div>
          </>
        )}
      </main>

      <Footer />
    </>
  );
}