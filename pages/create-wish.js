// pages/create-wish.js
"use client";
import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";
import KYCModal from "../components/KYCModal";

export default function CreateWish() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showKYC, setShowKYC] = useState(false);
  const [createdWishId, setCreatedWishId] = useState(null);

  // ✅ Check auth state when page loads
  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.replace(`/login?next=/create-wish`);
      } else {
        setUser(data.user);
      }
    };
    checkAuth();
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const { title, description, amount, location } = formData;
    if (!title || !description || !amount || !location) {
      setMessage("⚠️ Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("wishes")
        .insert([
          {
            title,
            description,
            amount,
            location,
            user_id: user.id,
          },
        ])
        .select("id")
        .single();

      if (error) throw error;

      setCreatedWishId(data.id);
      setMessage("🎉 Wish created successfully!");
      setShowKYC(true);

      setFormData({
        title: "",
        description: "",
        amount: "",
        location: "",
      });
    } catch (err) {
      console.error("Error creating wish:", err);
      setMessage("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKYCComplete = () => {
    setShowKYC(false);
    if (createdWishId) router.push(`/wish/${createdWishId}`);
  };

  return (
    <>
      <Head>
        <title>Create a Wish | WishhoffRichies</title>
      </Head>

      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f8fafc] to-[#e2e8f0] dark:from-slate-900 dark:to-slate-800 p-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 text-center">
            ✨ Create a Wish
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 text-center mb-6">
            Please fill in the details of your wish.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {["title", "location", "description", "amount"].map((field) =>
              field !== "description" ? (
                <input
                  key={field}
                  type={field === "amount" ? "number" : "text"}
                  name={field}
                  placeholder={
                    field === "amount"
                      ? "Target Amount (USD)"
                      : `${field.charAt(0).toUpperCase() + field.slice(1)}`
                  }
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
                  rows={5}
                  className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary transition"
                />
              )
            )}

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

      {showKYC && (
        <KYCModal
          userId={user?.id || "unknown"}
          onUploaded={handleKYCComplete}
          onClose={() => setShowKYC(false)}
        />
      )}
    </>
  );
}
