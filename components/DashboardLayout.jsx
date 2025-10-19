// components/DashboardLayout.jsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";

export default function DashboardLayout({ children, title = "Dashboard" }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      setUser(data?.user ?? null);
    }
    load();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <header className="bg-white dark:bg-slate-800 border-b dark:border-slate-700">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <Link href="/"><span className="font-bold text-primary">WishhoffRichies</span></Link>
            <span className="ml-3 text-sm text-slate-500 dark:text-slate-400">{title}</span>
          </div>

          <div className="flex items-center gap-4">
            <nav className="hidden sm:flex gap-3">
              <Link href="/dashboard/my-wishes" className="px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700">My Wishes</Link>
              <Link href="/dashboard/reports" className="px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700">Reports</Link>
              <Link href="/wish/new" className="px-3 py-2 bg-primary text-white rounded">New Wish</Link>
            </nav>

            <div className="text-right">
              <div className="text-sm">{user?.email ?? user?.user_metadata?.email ?? "Guest"}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{user?.id ? `UID: ${user.id.slice(0, 8)}…` : ""}</div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
