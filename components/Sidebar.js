"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Sidebar({ open, setOpen }) {
  const [user, setUser] = useState(null);

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
      {/* Sidebar overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 dark:bg-black/50 z-30 md:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Sidebar itself */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 transform transition-transform duration-300 z-40 
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Header */}
        <div className="p-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <div>
            <Link href="/" className="text-xl font-bold text-primary">
              💫 WishhoffRichies
            </Link>
            <div className="text-xs text-slate-500 mt-1">
              {user ? "User Dashboard" : "Guest Access"}
            </div>
          </div>

          <button
            onClick={() => setOpen((s) => !s)}
            className="md:hidden text-slate-600 dark:text-slate-200"
            aria-label="Toggle sidebar"
          >
            ×
          </button>
        </div>

        {/* User Info */}
        {user && (
          <div className="flex items-center gap-3 p-4 border-b border-slate-100 dark:border-slate-800">
            <img
              src={
                user.user_metadata?.avatar_url ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.user_metadata?.full_name || user.email.split("@")[0]
                )}&background=random`
              }
              alt="User avatar"
              className="w-10 h-10 rounded-full border border-slate-300 dark:border-slate-700"
            />
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {user.user_metadata?.full_name ||
                  user.email.split("@")[0] ||
                  "User"}
              </p>
              <p className="text-xs text-slate-500">
                {user.email || "Not signed in"}
              </p>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="p-4 space-y-2 overflow-y-auto">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                🏠 Dashboard
              </Link>
              <Link
                href="/dashboard/my-wishes"
                className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                🎁 My Wishes
              </Link>
              <Link
                href="/dashboard/donations"
                className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                💰 Donations
              </Link>
              <Link
                href="/dashboard/reports"
                className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                📊 Reports
              </Link>
              <Link
                href="/dashboard/kyc"
                className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                🪪 KYC / Profile
              </Link>
              <Link
                href="/dashboard/settings"
                className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                ⚙️ Settings
              </Link>

              <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2">
                {/* Theme & Translate */}
                <button
                  className="block w-full text-left px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  🌓 Theme Switcher
                </button>
                <button
                  className="block w-full text-left px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  🌐 Language Translator
                </button>

                {/* Sign out */}
                <button
                  onClick={signOut}
                  className="block w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition"
                >
                  🚪 Sign out
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                🔐 Login
              </Link>
              <Link
                href="/auth/signup"
                className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                📝 Signup
              </Link>
            </>
          )}

          <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-4">
            <Link
              href="/"
              className="block px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:underline"
            >
              🔗 Back to public site
            </Link>
          </div>
        </nav>
      </aside>
    </>
  );
}