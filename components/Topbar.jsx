// components/Topbar.jsx
"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Link from "next/link";

export default function Topbar() {
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

    return () => sub?.subscription?.unsubscribe?.() , (mounted = false);
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    // client will redirect via middleware if protected route
    window.location.href = "/";
  }

  return (
    <header className="w-full bg-transparent border-b border-slate-100 dark:border-slate-800 py-4 px-6">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            className="hidden md:block px-3 py-1 rounded bg-slate-100 dark:bg-slate-800"
            aria-label="menu"
          >
            ☰
          </button>
          <div>
            <h4 className="text-lg font-semibold">Welcome{user?.email ? `, ${user.email.split("@")[0]}` : ""}</h4>
            <div className="text-xs text-slate-500">Member since {user ? new Date(user?.created_at || Date.now()).toLocaleDateString() : "—"}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard/settings" className="text-sm text-slate-600 dark:text-slate-300 hover:underline">Settings</Link>
          <button onClick={signOut} className="px-3 py-2 bg-primary text-white rounded hover:opacity-90">Sign out</button>
        </div>
      </div>
    </header>
  );
}
