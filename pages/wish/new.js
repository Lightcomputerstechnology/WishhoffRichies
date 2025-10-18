// pages/wish/new.js
import Head from "next/head";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useState } from "react";
import { useRouter } from "next/router";

export default function New() {
  const [form, setForm] = useState({ name: "", email: "", title: "", description: "", amount: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const r = useRouter();

  const onChange = (e) => setForm(s => ({ ...s, [e.target.name]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setMessage("");
    // basic client validation
    if (!form.name || !form.email || !form.title || !form.description || !form.amount) {
      setMessage("Please fill all fields.");
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
      setMessage("🎉 Wish created — it will appear after moderation.");
      setForm({ name: "", email: "", title: "", description: "", amount: "" });
      // redirect to explore after a short delay
      setTimeout(() => r.push("/explore"), 1000);
    } catch (err) {
      setMessage(err.message || "Submission failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head><title>Make a Wish — WishhoffRichies</title></Head>
      <Navbar />
      <main className="container py-8">
        <div className="form-card">
          <h1 className="text-xl font-bold">Create a Wish</h1>
          <p className="muted">Share your story — keep it honest and specific.</p>
          <form onSubmit={submit} className="mt-4">
            <input name="name" placeholder="Your name" value={form.name} onChange={onChange} className="mb-3 w-full" required />
            <input name="email" placeholder="Email" type="email" value={form.email} onChange={onChange} className="mb-3 w-full" required />
            <input name="title" placeholder="Short title" value={form.title} onChange={onChange} className="mb-3 w-full" required />
            <textarea name="description" placeholder="Describe your need" value={form.description} onChange={onChange} className="mb-3 w-full" required />
            <input name="amount" type="number" placeholder="Amount (USD)" value={form.amount} onChange={onChange} className="mb-3 w-full" required min="1" step="0.01" />
            <div className="flex gap-3">
              <button type="submit" className="btn primary" disabled={loading}>{loading ? "Submitting…" : "Submit Wish"}</button>
              <a className="btn outline" href="/explore">Cancel</a>
            </div>
            {message && <p className={`message mt-3 ${message.startsWith("🎉") ? "" : "error"}`}>{message}</p>}
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}