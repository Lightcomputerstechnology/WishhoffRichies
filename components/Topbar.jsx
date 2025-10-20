"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Link from "next/link";
import Sidebar from "./Sidebar"; // ✅ import your standalone Sidebar

export default function Topbar() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      setUser(data?.user ?? null);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      sub?.subscription?.unsubscribe?.();
      mounted = false;
    };
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <>
      {/* ✅ Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* ✅ Topbar Header */}
      <header className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 py-3 px-5 z-30 sticky top-0">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Toggle sidebar button */}
            <button
              onClick={() => setSidebarOpen((o) => !o)}
              className="md:hidden p-2 rounded bg-slate-100 dark:bg-slate-800 text-lg"
              aria-label="Toggle menu"
            >
              ☰
            </button>

            <div>
              <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                {user ? `Welcome, ${user.user_metadata?.full_name || user.email.split("@")[0]}` : "Welcome Guest"}
              </h4>
              <p className="text-xs text-slate-500">
                {user
                  ? `Member since ${new Date(user.created_at).toLocaleDateString()}`
                  : "Please log in to access your dashboard"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle (placeholder) */}
            <button
              className="px-3 py-2 text-sm rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-200 hover:opacity-80"
              aria-label="Toggle theme"
            >
              🌓 Theme
            </button>

            {/* Translator (placeholder) */}
            <button
              className="px-3 py-2 text-sm rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-200 hover:opacity-80"
              aria-label="Language translator"
            >
              🌐 Translate
            </button>

            {user ? (
              <>
                {/* Avatar or fallback */}
                <img
                  src={
                    user.user_metadata?.avatar_url ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.user_metadata?.full_name || user.email.split("@")[0]
                    )}&background=random`
                  }
                  alt="User avatar"
                  className="w-9 h-9 rounded-full border border-slate-300 dark:border-slate-700"
                />
                <button
                  onClick={signOut}
                  className="px-3 py-2 bg-primary text-white text-sm rounded hover:opacity-90"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="px-3 py-2 bg-primary text-white text-sm rounded hover:opacity-90"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}