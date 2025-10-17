// pages/explore.js
import Head from "next/head";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WishCard from "../components/WishCard";

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
      </Head>

      <Navbar />
      <main className="container page">
        <header className="page-header">
          <h1>Explore Wishes</h1>
          <p className="subtitle">Find a wish that moves you — every gift matters.</p>
        </header>

        {loading ? (
          <p>Loading wishes…</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : wishes.length === 0 ? (
          <p>No wishes yet — be the first to <a href="/wish/new">make a wish</a>.</p>
        ) : (
          <div className="grid">
            {wishes.map((w) => <WishCard key={w.id} wish={w} />)}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
