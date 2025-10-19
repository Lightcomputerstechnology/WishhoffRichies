"use client";
import { useEffect, useState } from "react";
import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WishCard from "../components/WishCard";
import { supabase } from "../lib/supabaseClient";

// Mockup wishes for immediate display
const MOCK_WISHES = [
  { id: "mock1", title: "Travel to Paris", description: "I dream of visiting Paris and seeing the Eiffel Tower!", name: "Alice", amount: 1200 },
  { id: "mock2", title: "New Laptop", description: "I need a laptop to finish my college projects.", name: "Bob", amount: 850 },
  { id: "mock3", title: "Charity Donation", description: "Help me support a local orphanage this month.", name: "Clara", amount: 300 },
  { id: "mock4", title: "Music Studio Setup", description: "I want to record my own songs at home.", name: "David", amount: 1500 },
];

export default function Explore() {
  const [wishes, setWishes] = useState(MOCK_WISHES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let mounted = true;

    // Fetch initial wishes and subscribe to live changes
    async function fetchAndSubscribe() {
      try {
        // Initial fetch
        const { data, error } = await supabase
          .from("wishes")
          .select("*")
          .order("created_at", { ascending: false });

        if (!mounted) return;

        if (error) throw error;

        if (data && data.length > 0) {
          // Merge new data with mock wishes (avoid duplicates by ID)
          setWishes((prev) => {
            const ids = new Set(prev.map((w) => w.id));
            const merged = [...prev, ...data.filter((w) => !ids.has(w.id))];
            return merged;
          });
        }

        // Listen for real-time inserts
        const subscription = supabase
          .from("wishes")
          .on("INSERT", (payload) => {
            setWishes((prev) => {
              if (prev.find((w) => w.id === payload.new.id)) return prev;
              return [payload.new, ...prev];
            });
          })
          .subscribe();

        return () => {
          supabase.removeSubscription(subscription);
        };
      } catch (err) {
        console.error("Supabase fetch error:", err);
        setError("Unable to load real wishes. Showing mock wishes.");
      } finally {
        setLoading(false);
      }
    }

    fetchAndSubscribe();

    return () => (mounted = false);
  }, []);

  // Filter wishes by search query
  const filtered = wishes.filter(
    (w) =>
      w.title?.toLowerCase().includes(query.toLowerCase()) ||
      w.description?.toLowerCase().includes(query.toLowerCase())
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

      <main className="bg-light dark:bg-dark text-dark dark:text-light min-h-screen py-12 px-4 md:px-6">
        {/* Hero Section */}
        <section className="text-center mb-16 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold text-primary mb-4 animate-fade-in">
            Explore Wishes 💫
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg md:text-xl mb-6">
            Scroll through heartfelt wishes and discover people whose dreams you can help bring to life.
          </p>

          {/* Search Input */}
          <div className="flex justify-center">
            <input
              type="text"
              placeholder="🔍 Search wishes..."
              className="w-full max-w-md px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary transition shadow-md"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </section>

        {/* Status & Wish Grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <p className="text-slate-500 dark:text-slate-400 text-lg animate-pulse">Loading wishes…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center gap-4">
            <p className="text-slate-600 dark:text-slate-300 text-lg">No wishes match your search.</p>
            <Link href="/create-wish" className="px-6 py-3 rounded-xl bg-primary text-white hover:bg-primary/90 transition shadow-md font-semibold">
              ✨ Make a Wish
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((w) => (
              <div key={w.id} className="animate-fade-up" style={{ animationDelay: `${Math.random() * 0.3}s` }}>
                <WishCard wish={w} />
              </div>
            ))}
          </div>
        )}

        {/* Error Message */}
        {error && <p className="text-center mt-8 text-red-500 font-medium">{error}</p>}
      </main>

      <Footer />
    </>
  );
}