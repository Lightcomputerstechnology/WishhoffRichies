// pages/create-wish.js
"use client";
import Link from "next/link";
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import KYCModal from "../components/KYCModal";
import { supabase } from "../lib/supabaseClient";

export default function CreateWish() {
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    amount: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showKYC, setShowKYC] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.from("wishes").insert([formData]);
      if (error) throw error;

      setMessage("🎉 Wish created successfully!");
      setFormData({ name: "", title: "", description: "", amount: "" });
      setShowKYC(true); // prompt KYC modal after submission
    } catch (err) {
      console.error(err);
      setMessage("❌ Error creating wish. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Create a Wish | WishhoffRichies</title>
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-[#0b3d91] via-[#2563eb] to-[#0f172a] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 text-center">
            ✨ Make Your Wish
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 text-center mb-6">
            Fill in your wish details — maybe a kind heart will make it come true.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
            <input
              type="text"
              name="title"
              placeholder="Wish Title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
            <textarea
              name="description"
              placeholder="Describe your wish..."
              value={formData.description}
              onChange={handleChange}
              rows={5}
              required
              className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
            <input
              type="number"
              name="amount"
              placeholder="Amount Needed ($)"
              value={formData.amount}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary transition"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit Wish"}
            </button>
          </form>

          {message && (
            <p className="text-center mt-4 text-sm font-medium text-slate-800 dark:text-slate-100">
              {message}
            </p>
          )}

          <div className="mt-4 text-center">
            <Link href="/" className="text-primary hover:underline">
              🏠 Back to Home
            </Link>
          </div>
        </div>
      </main>

      {/* KYC Modal */}
      {showKYC && (
        <KYCModal
          userId={formData.name || formData.title} // fallback unique ID
          onUploaded={() => setShowKYC(false)}
          onClose={() => setShowKYC(false)}
        />
      )}
    </>
  );
}
