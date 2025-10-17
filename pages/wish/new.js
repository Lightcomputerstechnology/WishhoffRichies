// pages/wish/new.js
import Head from "next/head";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useRouter } from "next/router";

export default function NewWish() {
  const [form, setForm] = useState({ name: "", email: "", title: "", description: "", amount: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  function onChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/wishes/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create wish");
      setMessage("🎉 Wish submitted! It will appear after review.");
      // optionally navigate to explore
      setTimeout(() => router.push("/explore"), 900);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head><title>Make a Wish — WishhoffRichies</title></Head>
      <Navbar />
      <main className="container page">
        <div className="form-card">
          <h1>Create a Wish</h1>
          <p className="muted">Share your story — keep it honest and specific.</p>

          <form onSubmit={handleSubmit} className="wish-form">
            <input name="name" placeholder="Your name" value={form.name} onChange={onChange} required />
            <input name="email" placeholder="Your email" type="email" value={form.email} onChange={onChange} required />
            <input name="title" placeholder="Short title (e.g., School fees)" value={form.title} onChange={onChange} required />
            <textarea name="description" placeholder="Describe your need" value={form.description} onChange={onChange} required />
            <input name="amount" placeholder="Amount requested (USD)" type="number" value={form.amount} onChange={onChange} required />

            <div className="form-actions">
              <button type="submit" className="btn primary" disabled={loading}>{loading ? "Submitting…" : "Submit Wish"}</button>
              <a className="btn outline" href="/explore">Cancel</a>
            </div>
          </form>

          {message && <p className="message">{message}</p>}
        </div>
      </main>
      <Footer />
    </>
  );
}
