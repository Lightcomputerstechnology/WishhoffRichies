"use client";
import Link from "next/link";
import { useState } from "react";
import Head from "next/head";
import KYCModal from "../components/KYCModal";

export default function MakeWish() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    title: "",
    description: "",
    amount: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showKYC, setShowKYC] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Basic validation
    if (!formData.name || !formData.email || !formData.title || !formData.description || !formData.amount || !formData.location) {
      setMessage("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/wishes/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage("🎉 Wish created successfully!");
        setFormData({ name: "", email: "", title: "", description: "", amount: "", location: "" });
        setShowKYC(true); // Prompt KYC after creating wish
      } else {
        setMessage(data.error || "Something went wrong.");
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Make a Wish | WishhoffRichies</title>
      </Head>

      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f8fafc] to-[#e2e8f0] dark:from-slate-900 dark:to-slate-800 p-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 text-center">
            💫 Create Your Wish
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 text-center mb-6">
            Share your dream and let the world help make it come true.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {["name", "email", "title", "location", "description", "amount"].map((field) => (
              field !== "description" ? (
                <input
                  key={field}
                  type={field === "email" ? "email" : field === "amount" ? "number" : "text"}
                  name={field}
                  placeholder={field === "amount" ? "Target Amount (USD)" : `Your ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary transition"
                />
              ) : (
                <textarea
                  key={field}
                  name={field}
                  placeholder="Describe your wish..."
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary transition min-h-[100px]"
                />
              )
            ))}

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
        </div>
      </main>

      {/* KYC Modal */}
      {showKYC && (
        <KYCModal
          userId={formData.email} // or any unique user ID
          onUploaded={() => setShowKYC(false)}
          onClose={() => setShowKYC(false)}
        />
      )}
    </>
  );
}
