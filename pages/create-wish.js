"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import KYCModal from "../components/KYCModal";
import { supabase } from "../lib/supabaseClient";

export default function CreateWish() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    amount: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showKYC, setShowKYC] = useState(false);
  const [createdWishId, setCreatedWishId] = useState(null);
  const [user, setUser] = useState(null);

  // ✅ Check authentication when page loads
  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.replace(`/login?next=/create-wish`);
      } else {
        setUser(data.user);
      }
    };
    checkUser();
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const { name, title, description, amount, location } = formData;
    if (!name || !title || !description || !amount || !location) {
      setMessage("⚠️ Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      // ✅ Ensure user is still authenticated
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) {
        router.replace(`/login?next=/create-wish`);
        return;
      }

      const userId = sessionData.session.user.id;

      // ✅ Save wish to Supabase with user reference
      const { data, error } = await supabase
        .from("wishes")
        .insert([{ ...formData, user_id: userId }])
        .select("id")
        .single();

      if (error) throw error;

      setCreatedWishId(data.id);
      setMessage("🎉 Wish created successfully!");
      setShowKYC(true);

      setFormData({
        name: "",
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

      <main className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-[#e2e8f0] dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 text-center">
            ✨ Make Your Wish
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 text-center mb-6">
            Fill in your wish details — maybe a kind heart will make it come true.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {["name", "title", "location", "description", "amount"].map((field) =>
              field !== "description" ? (
                <input
                  key={field}
                  type={field === "amount" ? "number" : "text"}
                  name={field}
                  placeholder={
                    field === "amount"
                      ? "Target Amount (USD)"
                      : `Your ${field.charAt(0).toUpperCase() + field.slice(1)}`
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
          userId={user?.id || createdWishId}
          onUploaded={handleKYCComplete}
          onClose={() => setShowKYC(false)}
        />
      )}
    </>
  );
}
