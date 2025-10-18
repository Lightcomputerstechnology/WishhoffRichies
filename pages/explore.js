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

      <main className="container mx-auto px-6 py-16 min-h-screen">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100">
            Explore Wishes 💫
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            Find real stories that inspire compassion. Every little contribution helps
            someone move closer to their dream.
          </p>
        </header>

        {/* Loading, Error, Empty States */}
        {loading ? (
          <div className="flex justify-center py-12">
            <p className="text-slate-500 dark:text-slate-400 animate-pulse">
              Loading wishes…
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center py-12 text-center">
            <p className="text-red-500 font-medium mb-2">{error}</p>
            <button
              onClick={() => location.reload()}
              className="px-5 py-2 rounded bg-primary text-white hover:bg-primary/90 transition"
            >
              Try Again
            </button>
          </div>
        ) : wishes.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              No wishes yet — be the first to inspire hope!
            </p>
            <Link
              href="/wish/new"
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
            >
              Make a Wish
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishes.map((w) => (
              <WishCard key={w.id} wish={w} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}