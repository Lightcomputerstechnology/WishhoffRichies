// pages/dashboard/my-wishes.jsx
"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { supabase } from "../../lib/supabaseClient";
import Link from "next/link";

export default function MyWishesPage() {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", amount: "" });

  useEffect(() => {
    load();
    // listen for real-time changes (optional)
    const subscription = supabase
      .channel("public:wishes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "wishes" },
        () => load()
      )
      .subscribe();
    return () => supabase.removeChannel(subscription);
  }, []);

  async function load() {
    setLoading(true);
    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes?.user;
    if (!user) {
      setWishes([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("wishes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("load wishes error", error);
      setWishes([]);
    } else {
      setWishes(data || []);
    }
    setLoading(false);
  }

  function startEdit(w) {
    setEditingId(w.id);
    setForm({
      title: w.title || "",
      description: w.description || "",
      amount: w.amount || "",
    });
  }

  async function saveEdit(id) {
    setLoading(true);
    const { error } = await supabase
      .from("wishes")
      .update({
        title: form.title,
        description: form.description,
        amount: Number(form.amount),
      })
      .eq("id", id);

    if (error) console.error("update error", error);
    await load();
    setEditingId(null);
  }

  async function removeWish(id) {
    if (!confirm("Delete this wish? This cannot be undone.")) return;
    setLoading(true);
    const { error } = await supabase.from("wishes").delete().eq("id", id);
    if (error) console.error("delete error", error);
    await load();
  }

  return (
    <DashboardLayout title="My Wishes">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">My Wishes</h1>
          <Link href="/wish/new" className="px-4 py-2 bg-primary text-white rounded">Create Wish</Link>
        </div>

        {loading ? (
          <div className="p-6 bg-white dark:bg-slate-800 rounded shadow text-center">Loading…</div>
        ) : wishes.length === 0 ? (
          <div className="p-6 bg-white dark:bg-slate-800 rounded shadow text-center">
            You have no wishes yet. <Link href="/wish/new" className="text-primary">Create one</Link>.
          </div>
        ) : (
          <div className="grid gap-4">
            {wishes.map((w) => (
              <div key={w.id} className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow">
                {editingId === w.id ? (
                  <div className="space-y-3">
                    <input value={form.title} onChange={(e)=>setForm({...form, title: e.target.value})} className="w-full p-2 border rounded bg-transparent"/>
                    <textarea value={form.description} onChange={(e)=>setForm({...form, description: e.target.value})} className="w-full p-2 border rounded bg-transparent" rows={3}/>
                    <input type="number" value={form.amount} onChange={(e)=>setForm({...form, amount: e.target.value})} className="w-full p-2 border rounded bg-transparent"/>
                    <div className="flex gap-2">
                      <button onClick={()=>saveEdit(w.id)} className="px-3 py-2 bg-primary text-white rounded">Save</button>
                      <button onClick={()=>setEditingId(null)} className="px-3 py-2 rounded border">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="md:flex md:justify-between md:items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{w.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{w.description}</p>
                      <div className="text-xs text-slate-500 mt-2">Goal: ${w.amount} • Raised: ${w.raised_amount ?? 0}</div>
                      <div className="text-xs text-slate-400 mt-1">Created: {new Date(w.created_at).toLocaleString()}</div>
                    </div>

                    <div className="flex gap-2 mt-3 md:mt-0">
                      <Link href={`/wish/${w.id}`} className="px-3 py-2 rounded border">View</Link>
                      <button onClick={()=>startEdit(w)} className="px-3 py-2 rounded border">Edit</button>
                      <button onClick={()=>removeWish(w.id)} className="px-3 py-2 rounded bg-red-600 text-white">Delete</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
