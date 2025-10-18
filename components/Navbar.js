import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user ?? null);
    };
    getUser();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    const saved = typeof window !== "undefined" && localStorage.getItem("whr_dark");
    if (saved !== null) setDark(saved === "1");

    return () => sub?.subscription?.unsubscribe?.();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark-mode", dark);
    localStorage.setItem("whr_dark", dark ? "1" : "0");
  }, [dark]);

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <header className="sticky top-0 bg-white/90 backdrop-blur-md shadow-md dark:bg-slate-900 z-50">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <Link href="/" className="text-2xl font-bold text-[#1E3A8A] hover:opacity-90 transition">
          💫 WishhoffRichies
        </Link>

        <nav className="flex items-center gap-5">
          <Link href="/explore" className="nav-link">Explore</Link>
          <Link href="/wish/new" className="nav-link">Make a Wish</Link>

          {user ? (
            <>
              <Link href="/moderation" className="nav-link">Moderation</Link>
              <button onClick={signOut} className="btn-light">Sign out</button>
            </>
          ) : (
            <Link href="/admin/login" className="btn-light">Admin sign in</Link>
          )}

          <button
            aria-label="Toggle theme"
            onClick={() => setDark(d => !d)}
            className="ml-2 px-3 py-1 rounded bg-[#1E3A8A]/10 dark:bg-slate-700 hover:bg-[#1E3A8A]/20 transition"
          >
            {dark ? "🌙" : "☀️"}
          </button>
        </nav>
      </div>

      <style jsx>{`
        .nav-link {
          font-size: 0.95rem;
          color: #1E3A8A;
          text-decoration: none;
          transition: 0.3s;
        }
        .nav-link:hover {
          opacity: 0.7;
        }
        .btn-light {
          padding: 6px 14px;
          border-radius: 8px;
          background: #1E3A8A;
          color: white;
          font-size: 0.9rem;
          transition: 0.3s;
        }
        .btn-light:hover {
          background: #0f265a;
        }
      `}</style>
    </header>
  );
}