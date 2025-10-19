// components/UserCard.jsx
"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function UserCard() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      setProfile(data?.user ?? null);
    })();
    return () => (mounted = false);
  }, []);

  return (
    <div className="card p-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xl font-bold text-slate-700 dark:text-white">
          {profile?.email?.[0]?.toUpperCase() || "U"}
        </div>
        <div>
          <div className="font-semibold">{profile?.email ?? "Anonymous"}</div>
          <div className="text-sm text-slate-500">Verified: <span className="font-medium">{
            profile?.user_metadata?.verified ? "Yes" : "No"
          }</span></div>
          <div className="text-xs text-slate-400 mt-1">Joined {profile ? new Date(profile.created_at).toLocaleDateString() : "-"}</div>
        </div>
      </div>
    </div>
  );
}
