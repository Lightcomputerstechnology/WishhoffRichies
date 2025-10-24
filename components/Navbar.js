"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [dark, setDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 🔹 Track Supabase user session
  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user ?? null);
    };
    loadUser();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    const saved = localStorage.getItem("whr_dark");
    if (saved !== null) setDark(saved === "1");
    else setDark(window.matchMedia("(prefers-color-scheme: dark)").matches);

    return () => sub?.subscription?.unsubscribe?.();
  }, []);

  // 🔹 Apply theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("whr_dark", dark ? "1" : "0");
  }, [dark]);

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
  }

  // ----------------------------
  // Navbar UI
  // ----------------------------
  return (
    <>
      <header className="w-full bg-[var(--color-primary)] dark:bg-slate-900 shadow-md fixed top-0 left-0 z-50">
        <div className="flex items-center justify-between py-4 px-6 mx-auto max-w-screen-xl">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-white hover:opacity-90 transition">
              💫 WishhoffRichies
            </span>
          </Link>

          {/* Desktop menu */}
          <nav className="hidden md:flex items-center gap-6 text-white font-medium">
            <Link href="/explore" className="hover:opacity-80 transition">
              Explore
            </Link>
            <Link href="/create-wish" className="hover:opacity-80 transition">
              Make a Wish
            </Link>

            {/* Optional moderation (only admins or signed-in users) */}
            {user && (
              <Link href="/moderation" className="hover:opacity-80 transition">
                Moderation
              </Link>
            )}

            {/* --- Auth Controls --- */}
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-sm transition"
                >
                  Dashboard
                </Link>
                <button
                  onClick={signOut}
                  className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-sm transition"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-sm transition"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-sm transition"
                >
                  Sign up
                </Link>
                <Link
                  href="/admin/login"
                  className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-sm transition"
                >
                  Admin
                </Link>
              </>
            )}

            {/* Theme toggle */}
            <button
              aria-label="Toggle theme"
              onClick={() => setDark((d) => !d)}
              className="ml-2 px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-sm transition"
            >
              {dark ? "🌙" : "☀️"}
            </button>
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-white text-2xl focus:outline-none"
          >
            ☰
          </button>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-[var(--color-primary)] dark:bg-slate-800 shadow-lg transform transition-transform duration-300 z-[60] ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/20">
          <h2 className="text-lg font-semibold text-white">Menu</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white text-2xl focus:outline-none"
          >
            ×
          </button>
        </div>

        <nav className="flex flex-col gap-4 mt-6 px-5 text-white">
          <Link href="/explore" onClick={() => setSidebarOpen(false)}>
            Explore
          </Link>
          <Link href="/create-wish" onClick={() => setSidebarOpen(false)}>
            Make a Wish
          </Link>
          {user && (
            <Link href="/moderation" onClick={() => setSidebarOpen(false)}>
              Moderation
            </Link>
          )}

          {user ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setSidebarOpen(false)}
                className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-sm transition"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  signOut();
                  setSidebarOpen(false);
                }}
                className="text-left px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-sm transition"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setSidebarOpen(false)}
                className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-sm transition"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                onClick={() => setSidebarOpen(false)}
                className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-sm transition"
              >
                Sign up
              </Link>
              <Link
                href="/admin/login"
                onClick={() => setSidebarOpen(false)}
                className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-sm transition"
              >
                Admin
              </Link>
            </>
          )}

          <button
            aria-label="Toggle theme"
            onClick={() => setDark((d) => !d)}
            className="px-3 py-1 mt-3 rounded bg-white/10 hover:bg-white/20 text-sm transition"
          >
            {dark ? "🌙 Dark" : "☀️ Light"}
          </button>
        </nav>
      </div>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[55]"
        ></div>
      )}
    </>
  );
}
