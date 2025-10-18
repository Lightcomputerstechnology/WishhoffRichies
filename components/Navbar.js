// components/Navbar.js
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setUser(supabase.auth.getUser ? null : null); // noop to avoid linter noise
    // listen for auth changes
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user ?? null);
    };
    getUser();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    // load theme
    const saved = typeof window !== "undefined" && localStorage.getItem("whr_dark");
    if (saved !== null) setDark(saved === "1");
    else {
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDark(prefersDark);
    }
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
    <header className="bg-white dark:bg-slate-900 shadow">
      <div className="container flex items-center justify-between py-4">
        <Link href="/"><a className="text-xl font-bold text-primary">💫 WishhoffRichies</a></Link>

        <nav className="flex items-center gap-4">
          <Link href="/explore"><a className="text-sm text-slate-700 dark:text-slate-200">Explore</a></Link>
          <Link href="/wish/new"><a className="text-sm text-slate-700 dark:text-slate-200">Make a Wish</a></Link>

          {user ? (
            <>
              {/* Show moderation link only when signed in; moderation route will further check role */}
              <Link href="/moderation"><a className="text-sm text-slate-700 dark:text-slate-200">Moderation</a></Link>

              <button
                onClick={signOut}
                className="ml-2 px-3 py-1 rounded bg-slate-100 dark:bg-slate-700 text-sm"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link href="/admin/login"><a className="ml-2 px-3 py-1 rounded bg-slate-100 dark:bg-slate-700 text-sm">Admin sign in</a></Link>
          )}

          <button aria-label="Toggle theme" onClick={() => setDark(d => !d)} className="ml-2 px-3 py-1 rounded bg-slate-100 dark:bg-slate-700">
            {dark ? "🌙" : "☀️"}
          </button>
        </nav>
      </div>
    </header>
  );
}