"use client";
import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WishCard from "../components/WishCard";

export default function Explore() {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 12; // wishes per page

  useEffect(() => {
    fetchWishes(page);
  }, [page]);

  const fetchWishes = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/wishes/list?page=${pageNumber}&limit=${LIMIT}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch wishes");

      if (pageNumber === 1) setWishes(data.wishes);
      else setWishes((prev) => [...prev, ...data.wishes]);

      setHasMore(data.wishes.length === LIMIT);
    } catch (err) {
      console.error(err);
      setError("Unable to load wishes right now.");
    } finally {
      setLoading(false);
    }
  };

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

      <main className="bg-light dark:bg-dark text-dark dark:text-light min-h-screen py-12 px-4 md:px-6">
        {/* Hero Section */}
        <section className="text-center mb-16 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold text-primary mb-4 animate-fade-in">
            Explore Wishes 💫
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg md:text-xl mb-6">
            Scroll through heartfelt wishes and discover people whose dreams you can help
            bring to life.
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

        {/* Status Handling */}
        {loading && wishes.length === 0 ? (
          <div className="flex justify-center py-16">
            <p className="text-slate-500 dark:text-slate-400 text-lg animate-pulse">
              Loading wishes…
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center py-12 text-center gap-4">
            <p className="text-red-500 font-medium">{error}</p>
            <button
              onClick={() => fetchWishes(page)}
              className="px-6 py-3 rounded-xl bg-primary text-white hover:bg-primary/90 transition shadow-md font-semibold"
            >
              Try Again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center gap-4">
            <p className="text-slate-600 dark:text-slate-300 text-lg">
              No wishes match your search — or none have been added yet.
            </p>
            <Link
              href="/wish/new"
              className="px-6 py-3 rounded-xl bg-primary text-white hover:bg-primary/90 transition shadow-md font-semibold"
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

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setPage((prev) => prev + 1)}
                  className="px-6 py-3 rounded-xl border border-primary text-primary hover:bg-primary hover:text-white transition shadow-md font-semibold"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Load More Wishes"}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </>
  );
}