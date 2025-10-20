// pages/wish/new.js
"use client";
import Link from "next/link";
import Head from "next/head";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useState } from "react";
import { useRouter } from "next/router";
import KYCModal from "../../components/KYCModals";

export default function NewWish() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    title: "",
    description: "",
    amount: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showKYC, setShowKYC] = useState(false);
  const router = useRouter();

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (!form.name || !form.email || !form.title || !form.description || !form.amount) {
      setMessage("⚠️ Please fill in all fields before submitting.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/wishes/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create wish");

      setMessage("🎉 Your wish has been created! It’ll appear after moderation.");
      setForm({ name: "", email: "", title: "", description: "", amount: "" });

      // Show KYC modal after submission
      setShowKYC(true);
      setTimeout(() => router.push("/explore"), 1200);
    } catch (err) {
      setMessage(err.message || "Submission failed. Try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Create Wish — WishhoffRichies</title>
      </Head>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-[#0b3d91] via-[#2563eb] to-[#0f172a] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-3 text-center">
            ✨ Create Your Wish
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 text-center mb-6">
            Share your story — keep it honest and inspiring ✨
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={onChange}
              required
              className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={onChange}
              required
              className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
            <input
              type="text"
              name="title"
              placeholder="Wish Title"
              value={form.title}
              onChange={onChange}
              required
              className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
            <textarea
              name="description"
              placeholder="Tell your story — what do you wish for?"
              value={form.description}
              onChange={onChange}
              rows={5}
              required
              className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
            <input
              type="number"
              name="amount"
              placeholder="Goal Amount (USD)"
              value={form.amount}
              onChange={onChange}
              min="1"
              step="0.01"
              required
              className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary transition"
            />

            <div className="flex justify-between mt-4">
              <button
                type="submit"
                className="bg-primary text-white py-3 px-5 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Submitting…" : "Submit Wish"}
              </button>
              <Link href="/explore" className="border border-primary text-primary py-3 px-5 rounded-lg hover:bg-primary/10 transition flex items-center justify-center">
                Cancel
              </Link>
            </div>

            {message && (
              <p className={`text-center mt-4 p-2 rounded-lg ${message.startsWith("🎉") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"}`}>
                {message}
              </p>
            )}
          </form>
        </div>
      </main>

      <Footer />

      {showKYC && (
        <KYCModals
          userId={form.name || form.title}
          onUploaded={() => setShowKYC(false)}
          onClose={() => setShowKYC(false)}
        />
      )}
    </>
  );
}
