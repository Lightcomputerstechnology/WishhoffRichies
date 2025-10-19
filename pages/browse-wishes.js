import { useEffect, useState } from "react";
import Head from "next/head";
import { supabase } from "../lib/supabaseClient";
import WishCard from "../components/WishCard";

export default function BrowseWishes() {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishes();
  }, []);

  const fetchWishes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("wishes")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.error("Error fetching wishes:", error);
    else setWishes(data || []);
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Browse Wishes | WishhoffRichies</title>
      </Head>

      <main className="min-h-screen bg-light dark:bg-dark text-dark dark:text-light flex flex-col">
        {/* Navbar */}
        <nav className="navbar flex justify-between items-center px-6 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 shadow-md">
          <h1 className="logo text-2xl font-bold text-primary">💫 WishhoffRichies</h1>
        </nav>

        {/* Browse Section */}
        <section className="container mx-auto px-6 py-16 flex flex-col gap-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-primary mb-2 animate-fade-up">
            🌠 Browse Wishes
          </h2>
          <p className="text-center text-slate-600 dark:text-slate-300 mb-10 animate-fade-up">
            See what dreams others have shared — maybe yours is the hand that helps them shine.
          </p>

          {loading ? (
            <p className="text-center text-lg text-slate-500">Loading wishes...</p>
          ) : wishes.length === 0 ? (
            <p className="text-center text-lg text-slate-500">
              No wishes yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {wishes.map((wish) => (
                <WishCard key={wish.id} wish={wish} />
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="bg-[#0F172A] text-slate-200 py-12 mt-auto border-t border-slate-700 text-center">
          © {new Date().getFullYear()} WishhoffRichies — Built with ❤️ by Light Tech Hub
        </footer>
      </main>
    </>
  );
}