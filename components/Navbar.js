// components/Navbar.js
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // Load user
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user ?? null);
    };
    getUser();

    // Listen to auth changes
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Load theme from localStorage or system
    const saved = localStorage.getItem("whr_dark");
    if (saved !== null) {
      setDark(saved === "1");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDark(prefersDark);
    }

    return () => sub?.subscription?.unsubscribe?.();
  }, []);

  // Apply theme when dark mode toggles
  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("whr_dark", dark ? "1" : "0");
  }, [dark]);

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <header className="w-full bg-[var(--color-primary)] dark:bg-slate-900 shadow-md fixed top-0 left-0 z-50">
      <div className="container flex items-center justify-between py-4 px-6 mx-auto max-w-screen-xl">
        <Link href="/">
          <span className="text-xl font-bold text-white hover:opacity-90 transition">
            💫 WishhoffRichies
          </span>
        </Link>

        <nav className="flex items-center gap-5 text-white">
          <Link href="/explore" className="hover:underline">
            Explore
          </Link>
          <Link href="/wish/new" className="hover:underline">
            Make a Wish
          </Link>

          {user ? (
            <>
              <Link href="/moderation" className="hover:underline">
                Moderation
              </Link>
              <button
                onClick={signOut}
                className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-sm transition"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/admin/login"
              className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-sm transition"
            >
              Admin sign in
            </Link>
          )}

          {/* Theme toggle */}
          <button
            aria-label="Toggle theme"
            onClick={() => setDark((d) => !d)}
            className="ml-3 px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-sm transition"
          >
            {dark ? "🌙" : "☀️"}
          </button>
        </nav>
      </div>
    </header>
  );
}
