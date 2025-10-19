"use client";
import Link from "next/link";
import Head from "next/head";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WishCard from "../components/WishCard";
import { supabase } from "../lib/supabaseClient";

// Mock Data
const generateMockWishes = () => [
  { id: "m1", name: "James Smith", title: "New Laptop for Coding", description: "I need a laptop to learn web development and build projects.", amount: 500, verified: true, image: "/sample1.jpg" },
  { id: "m2", name: "Emily Johnson", title: "Guitar Lessons", description: "I want to take guitar lessons and start a small band.", amount: 200, verified: false, image: "/sample2.jpg" },
  { id: "m3", name: "Michael Brown", title: "Charity Support", description: "Help me fund a small charity project in my neighborhood.", amount: 300, verified: true, image: "/sample3.jpg" },
  { id: "m4", name: "Olivia Davis", title: "Medical Expenses", description: "I need assistance with medical bills for my family.", amount: 1000, verified: true, image: "/sample4.jpg" },
  // … add more mock wishes as needed
];

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
          setWishes(generateMockWishes());
        } else {
          setWishes(data);
        }
      } catch (err) {
        console.error(err);
        setWishes(generateMockWishes());
      } finally {
        setLoading(false);
      }
    }
    loadWishes();
    return () => (mounted = false);
  }, []);

  const filtered = wishes.filter(
    (w) =>
      w.title?.toLowerCase().includes(query.toLowerCase()) ||
      w.description?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>Explore Wishes — WishhoffRichies</title>
        <meta name="description" content="Discover verified wishes from real people and help make them come true." />
      </Head>

      <Navbar />

      <main className="min-h-screen px-6 py-20 bg-gradient-to-b from-[#f8fafc] to-[#e2e8f0] dark:from-slate-900 dark:to-slate-800">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold text-primary mb-4 animate-fade-in">
            Explore Wishes 💫
          </h1>
          <p className="text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-6 text-lg">
            Scroll through heartfelt wishes and discover people whose dreams you can help bring to life.
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

        {/* Loading / Empty States */}
        {loading ? (
          <div className="flex justify-center py-16">
            <p className="text-slate-500 dark:text-slate-400 animate-pulse">Loading wishes…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              No wishes match your search — be the first to make one!
            </p>
            <Link href="/create-wish" className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition">
              ✨ Make a Wish
            </Link>
          </div>
        ) : (
          <>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((wish) => (
                <div key={wish.id} className="animate-fade-up" style={{ animationDelay: `${Math.random() * 0.3}s` }}>
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