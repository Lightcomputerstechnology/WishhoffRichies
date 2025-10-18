import Head from "next/head";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WishCard from "../components/WishCard";
import Link from "next/link";

export default function Explore() {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch("/api/wishes/list");
        const data = await res.json();
        if (!mounted) return;
        if (!res.ok) throw new Error(data.error || "Failed to fetch wishes");
        setWishes(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load wishes right now.");
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  // simple search filtering
  const filtered = wishes.filter((w) =>
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

      <main className="container mx-auto px-6 py-12 min-h-screen">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-primary mb-3 animate-fade-in">
            Explore Wishes 💫
          </h1>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-6">
            Scroll through heartfelt wishes and discover people whose dreams you can help
            bring to life.
          </p>

          {/* Search / Filter */}
          <div className="flex justify-center">
            <input
              type="text"
              placeholder="🔍 Search wishes..."
              className="w-full max-w-md px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary outline-none transition"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </section>

        {/* Loading, Error, Empty States */}
        {loading ? (
          <div className="flex justify-center py-16">
            <p className="text-slate-500 dark:text-slate-400 animate-pulse">
              Loading wishes…
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center py-12 text-center">
            <p className="text-red-500 font-medium mb-3">{error}</p>
            <button
              onClick={() => location.reload()}
              className="px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition"
            >
              Try Again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              No wishes match your search — or none have been added yet.
            </p>
            <Link
              href="/wish/new"
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
            >
              ✨ Make a Wish
            </Link>
          </div>
        ) : (
          <>
            {/* Wish Grid */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((w) => (
                <div
                  key={w.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${Math.random() * 0.3}s` }}
                >
                  <WishCard wish={w} />
                </div>
              ))}
            </div>

            {/* Load More Button (mock for now) */}
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
