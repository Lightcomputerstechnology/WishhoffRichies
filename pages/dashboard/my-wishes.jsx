// pages/dashboard/my-wishes.jsx
"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { supabase } from "../../lib/supabaseClient";
import Link from "next/link";
import { toast } from "react-toastify";

export default function MyWishesPage() {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ title: "", description: "", amount: 0 });

  useEffect(() => {
    loadWishes();
  }, []);

  async function loadWishes() {
    setLoading(true);
    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes?.user;
    if (!user) return;

    const { data, error } = await supabase
      .from("wishes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) console.error(error);
    else setWishes(data);
    setLoading(false);
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this wish?")) return;
    const { error } = await supabase.from("wishes").delete().eq("id", id);
    if (error) return toast.error("Delete failed");
    toast.success("Wish deleted");
    setWishes((prev) => prev.filter((w) => w.id !== id));
  }

  function startEdit(wish) {
    setEditing(wish.id);
    setFormData({
      title: wish.title,
      description: wish.description,
      amount: wish.amount,
    });
  }

  async function handleUpdate(id) {
    const { error } = await supabase
      .from("wishes")
      .update({
        title: formData.title,
        description: formData.description,
        amount: Number(formData.amount),
      })
      .eq("id", id);

    if (error) {
      toast.error("Update failed");
    } else {
      toast.success("Wish updated");
      setEditing(null);
      loadWishes();
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">My Wishes</h1>
          <Link href="/wish/new" className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90">
            + New Wish
          </Link>
        </div>

        {loading ? (
          <div className="p-6 bg-white dark:bg-slate-800 rounded-lg text-center">Loading wishes...</div>
        ) : wishes.length === 0 ? (
          <div className="p-6 bg-white dark:bg-slate-800 rounded-lg text-center">
            You haven’t created any wishes yet.
          </div>
        ) : (
          <div className="grid gap-4">
            {wishes.map((wish) => (
              <div key={wish.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-5">
                {editing === wish.id ? (
                  <div className="space-y-3">
                    <input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full border border-slate-300 dark:border-slate-700 rounded px-3 py-2 bg-transparent"
                    />
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full border border-slate-300 dark:border-slate-700 rounded px-3 py-2 bg-transparent"
                    />
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full border border-slate-300 dark:border-slate-700 rounded px-3 py-2 bg-transparent"
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(wish.id)}
                        className="px-3 py-2 bg-primary text-white rounded"
                      >
                        Save
                      </button>
                      <button onClick={() => setEditing(null)} className="px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row justify-between md:items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{wish.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{wish.description}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Goal: ${wish.amount} | Raised: ${wish.raised_amount || 0}
                      </p>
                    </div>

                    <div className="flex gap-2 mt-3 md:mt-0">
                      <button
                        onClick={() => startEdit(wish)}
                        className="px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(wish.id)}
                        className="px-3 py-2 bg-red-600 text-white rounded text-sm"
                      >
                        Delete
                      </button>
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
