// pages/wish/new.js
import Head from "next/head";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useState } from "react";
import { useRouter } from "next/router";

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

      <main className="new-wish-page">
        <section className="form-wrapper">
          <h1>Create a Wish</h1>
          <p className="subtitle">Share your story — keep it honest and inspiring ✨</p>

          <form onSubmit={handleSubmit}>
            <label>Your Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Sarah Adams"
              value={form.name}
              onChange={onChange}
              required
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={onChange}
              required
            />

            <label>Wish Title</label>
            <input
              type="text"
              name="title"
              placeholder="A short and clear wish title"
              value={form.title}
              onChange={onChange}
              required
            />

            <label>Description</label>
            <textarea
              name="description"
              placeholder="Tell your story — what do you wish for?"
              value={form.description}
              onChange={onChange}
              required
            />

            <label>Goal Amount (USD)</label>
            <input
              type="number"
              name="amount"
              placeholder="Enter target amount"
              value={form.amount}
              onChange={onChange}
              min="1"
              step="0.01"
              required
            />

            <div className="button-group">
              <button type="submit" className="btn primary" disabled={loading}>
                {loading ? "Submitting…" : "Submit Wish"}
              </button>
              <a href="/explore" className="btn outline">
                Cancel
              </a>
            </div>

            {message && (
              <p className={`message ${message.startsWith("🎉") ? "success" : "error"}`}>
                {message}
              </p>
            )}
          </form>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        .new-wish-page {
          background-color: #f9fbff;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 4rem 1rem;
        }

        .form-wrapper {
          background: #fff;
          border-radius: 10px;
          padding: 2rem;
          width: 100%;
          max-width: 600px;
          box-shadow: 0 4px 12px rgba(0, 30, 60, 0.1);
          border: 1px solid #e0e7ff;
        }

        h1 {
          color: #0f1d40;
          font-size: 1.8rem;
          margin-bottom: 0.4rem;
          text-align: center;
        }

        .subtitle {
          color: #5a6e9e;
          font-size: 0.95rem;
          text-align: center;
          margin-bottom: 1.5rem;
        }

        label {
          display: block;
          margin-top: 1rem;
          font-weight: 600;
          color: #0f1d40;
        }

        input,
        textarea {
          width: 100%;
          margin-top: 0.4rem;
          padding: 0.8rem;
          border: 1px solid #cdd6f4;
          border-radius: 6px;
          background: #fdfdfd;
          font-size: 1rem;
          color: #1a2a57;
          transition: border-color 0.2s;
        }

        input:focus,
        textarea:focus {
          border-color: #2547d0;
          outline: none;
          box-shadow: 0 0 0 2px rgba(37, 71, 208, 0.1);
        }

        textarea {
          min-height: 120px;
          resize: vertical;
        }

        .button-group {
          display: flex;
          justify-content: space-between;
          margin-top: 1.5rem;
        }

        .btn {
          border-radius: 6px;
          padding: 0.7rem 1.5rem;
          font-weight: 600;
          cursor: pointer;
          text-align: center;
          transition: background 0.2s, color 0.2s;
        }

        .btn.primary {
          background: #2547d0;
          color: #fff;
          border: none;
        }

        .btn.primary:hover {
          background: #1d3cb8;
        }

        .btn.outline {
          border: 1px solid #2547d0;
          color: #2547d0;
          background: transparent;
        }

        .btn.outline:hover {
          background: #eaf0ff;
        }

        .message {
          margin-top: 1rem;
          text-align: center;
          font-size: 0.95rem;
          padding: 0.6rem;
          border-radius: 6px;
        }

        .message.error {
          background: #ffeaea;
          color: #b00020;
        }

        .message.success {
          background: #e8f7e9;
          color: #147d14;
        }
      `}</style>
    </>
  );
}