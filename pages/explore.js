"use client";
import Link from "next/link";
import Head from "next/head";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WishCard from "../components/WishCard";
import { supabase } from "../lib/supabaseClient";

// Generate 20 mock wishes with varied progress, verified status, location, and image
const generateMockWishes = () => [
  { id: "m1", name: "James Smith", title: "New Laptop for Coding", description: "I need a laptop to learn web development and build projects.", amount: 500, verified: true, image: "/sample1.jpg", location: "New York, USA", created_at: "2025-10-18T10:00:00Z" },
  { id: "m2", name: "Emily Johnson", title: "Guitar Lessons", description: "I want to take guitar lessons and start a small band.", amount: 200, verified: false, image: "/sample2.jpg", location: "Los Angeles, USA", created_at: "2025-10-17T14:30:00Z" },
  { id: "m3", name: "Michael Brown", title: "Charity Support", description: "Help me fund a small charity project in my neighborhood.", amount: 300, verified: true, image: "/sample3.jpg", location: "Chicago, USA", created_at: "2025-10-15T09:20:00Z" },
  { id: "m4", name: "Olivia Davis", title: "Medical Expenses", description: "I need assistance with medical bills for my family.", amount: 1000, verified: true, image: "/sample4.jpg", location: "Houston, USA", created_at: "2025-10-10T08:15:00Z" },
  { id: "m5", name: "William Miller", title: "Photography Gear", description: "I need a camera and lens to pursue photography professionally.", amount: 750, verified: false, image: "/sample5.jpg", location: "Miami, USA", created_at: "2025-10-12T16:00:00Z" },
  { id: "m6", name: "Sophia Wilson", title: "Art Supplies", description: "Help me buy art materials for my school project.", amount: 150, verified: true, image: "/sample6.jpg", location: "Atlanta, USA", created_at: "2025-10-14T11:40:00Z" },
  { id: "m7", name: "Alexander Moore", title: "Laptop Upgrade", description: "My old laptop can't run development software anymore.", amount: 600, verified: false, image: "/sample7.jpg", location: "Dallas, USA", created_at: "2025-10-16T13:50:00Z" },
  { id: "m8", name: "Isabella Taylor", title: "Music Production Software", description: "I want to create music but need proper software.", amount: 350, verified: true, image: "/sample8.jpg", location: "San Francisco, USA", created_at: "2025-10-13T15:25:00Z" },
  { id: "m9", name: "Ethan Anderson", title: "Basketball Gear", description: "I want to buy proper gear to practice basketball.", amount: 250, verified: false, image: "/sample9.jpg", location: "Seattle, USA", created_at: "2025-10-11T12:10:00Z" },
  { id: "m10", name: "Mia Thomas", title: "Scholarship Fund", description: "Help me pay for college tuition this semester.", amount: 1200, verified: true, image: "/sample10.jpg", location: "Boston, USA", created_at: "2025-10-09T10:45:00Z" },
  { id: "m11", name: "Daniel Jackson", title: "Bike for Commuting", description: "I need a bike to commute to work safely.", amount: 400, verified: true, image: "/sample11.jpg", location: "Philadelphia, USA", created_at: "2025-10-18T07:30:00Z" },
  { id: "m12", name: "Charlotte White", title: "Laptop Stand & Desk", description: "Help me create a proper home office setup.", amount: 200, verified: false, image: "/sample12.jpg", location: "Denver, USA", created_at: "2025-10-15T09:10:00Z" },
  { id: "m13", name: "Matthew Harris", title: "Coding Bootcamp", description: "I want to join a coding bootcamp to improve my skills.", amount: 1500, verified: true, image: "/sample13.jpg", location: "Austin, USA", created_at: "2025-10-17T17:00:00Z" },
  { id: "m14", name: "Amelia Martin", title: "Photography Workshop", description: "I want to attend a photography workshop this summer.", amount: 350, verified: false, image: "/sample14.jpg", location: "Portland, USA", created_at: "2025-10-16T12:50:00Z" },
  { id: "m15", name: "David Thompson", title: "Charity Run", description: "Fund my participation in a charity marathon.", amount: 100, verified: true, image: "/sample15.jpg", location: "Orlando, USA", created_at: "2025-10-14T08:20:00Z" },
  { id: "m16", name: "Grace Garcia", title: "Art Exhibition", description: "I want to showcase my artwork in a local gallery.", amount: 500, verified: true, image: "/sample16.jpg", location: "San Diego, USA", created_at: "2025-10-13T14:35:00Z" },
  { id: "m17", name: "Joseph Martinez", title: "Musical Instrument", description: "I need a keyboard to learn music composition.", amount: 400, verified: false, image: "/sample17.jpg", location: "Las Vegas, USA", created_at: "2025-10-12T10:50:00Z" },
  { id: "m18", name: "Abigail Robinson", title: "Cooking Classes", description: "I want to attend advanced cooking classes.", amount: 250, verified: true, image: "/sample18.jpg", location: "Phoenix, USA", created_at: "2025-10-11T09:05:00Z" },
  { id: "m19", name: "Christopher Clark", title: "Fitness Equipment", description: "I need a home gym setup to stay healthy.", amount: 600, verified: false, image: "/sample19.jpg", location: "Minneapolis, USA", created_at: "2025-10-10T11:15:00Z" },
  { id: "m20", name: "Elizabeth Rodriguez", title: "Laptop for School", description: "I need a new laptop for school assignments.", amount: 700, verified: true, image: "/sample20.jpg", location: "Charlotte, USA", created_at: "2025-10-09T13:25:00Z" },
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