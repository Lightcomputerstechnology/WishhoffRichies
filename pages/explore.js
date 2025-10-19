"use client";
import Link from "next/link";
import Head from "next/head";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WishCard from "../components/WishCard";
import { supabase } from "../lib/supabaseClient";

// Generate mock data
const generateMockWishes = () => [
  { id: "m1", name: "James Smith", title: "New Laptop for Coding", description: "I need a laptop to learn web development and build projects.", amount: 500 },
  { id: "m2", name: "Emily Johnson", title: "Guitar Lessons", description: "I want to take guitar lessons and start a small band.", amount: 200 },
  { id: "m3", name: "Michael Brown", title: "Charity Support", description: "Help me fund a small charity project in my neighborhood.", amount: 300 },
  { id: "m4", name: "Olivia Davis", title: "Medical Expenses", description: "I need assistance with medical bills for my family.", amount: 1000 },
  { id: "m5", name: "William Miller", title: "Photography Gear", description: "I need a camera and lens to pursue photography professionally.", amount: 750 },
  { id: "m6", name: "Sophia Wilson", title: "Art Supplies", description: "Help me buy art materials for my school project.", amount: 150 },
  { id: "m7", name: "Alexander Moore", title: "Laptop Upgrade", description: "My old laptop can't run development software anymore.", amount: 600 },
  { id: "m8", name: "Isabella Taylor", title: "Music Production Software", description: "I want to create music but need proper software.", amount: 350 },
  { id: "m9", name: "Ethan Anderson", title: "Basketball Gear", description: "I want to buy proper gear to practice basketball.", amount: 250 },
  { id: "m10", name: "Mia Thomas", title: "Scholarship Fund", description: "Help me pay for college tuition this semester.", amount: 1200 },
  { id: "m11", name: "Daniel Jackson", title: "Bike for Commuting", description: "I need a bike to commute to work safely.", amount: 400 },
  { id: "m12", name: "Charlotte White", title: "Laptop Stand & Desk", description: "Help me create a proper home office setup.", amount: 200 },
  { id: "m13", name: "Matthew Harris", title: "Coding Bootcamp", description: "I want to join a coding bootcamp to improve my skills.", amount: 1500 },
  { id: "m14", name: "Amelia Martin", title: "Photography Workshop", description: "I want to attend a photography workshop this summer.", amount: 350 },
  { id: "m15", name: "David Thompson", title: "Charity Run", description: "Fund my participation in a charity marathon.", amount: 100 },
  { id: "m16", name: "Grace Garcia", title: "Art Exhibition", description: "I want to showcase my artwork in a local gallery.", amount: 500 },
  { id: "m17", name: "Joseph Martinez", title: "Musical Instrument", description: "I need a keyboard to learn music composition.", amount: 400 },
  { id: "m18", name: "Abigail Robinson", title: "Cooking Classes", description: "I want to attend advanced cooking classes.", amount: 250 },
  { id: "m19", name: "Christopher Clark", title: "Fitness Equipment", description: "I need a home gym setup to stay healthy.", amount: 600 },
  { id: "m20", name: "Elizabeth Rodriguez", title: "Laptop for School", description: "I need a new laptop for school assignments.", amount: 700 },
];

export default function Explore() {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        // Fetch from Supabase
        const { data, error } = await supabase.from("wishes").select("*").order("created_at", { ascending: false });
        if (!mounted) return;
        if (error || !data || data.length === 0) {
          // Fallback to mock data
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
    load();
    return () => (mounted = false);
  }, []);

  // Search filtering
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

      <main className="container mx-auto px-6 py-20 min-h-screen">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold text-primary mb-4 animate-fade-in">
            Explore Wishes 💫
          </h1>
          <p className="text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-6 text-lg">
            Scroll through heartfelt wishes and discover people whose dreams you can help bring to life.
          </p>

          {/* Search / Filter */}
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
                <div key={w.id} className="animate-fade-up" style={{ animationDelay: `${Math.random() * 0.3}s` }}>
                  <WishCard wish={w} />
                </div>
              ))}
            </div>

            {/* Load More Button */}
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