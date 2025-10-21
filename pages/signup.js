"use client";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";
import Head from "next/head";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      router.push("/login");
    } catch (err) {
      console.error("Signup error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign Up | LightTech Wishes</title>
      </Head>

      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-900 px-6">
        <div className="bg-white dark:bg-slate-800 shadow-xl rounded-2xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-center text-primary dark:text-blue-400 mb-6">
            Create Account 🌟
          </h1>

          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-200 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-200 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="Create password"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-200 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="Confirm password"
              />
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold text-white transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary hover:bg-primary/90"
              }`}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <div className="text-center mt-6 text-sm text-slate-500 dark:text-slate-400">
            <p>
              Already have an account?{" "}
              <Link href="/login" className="text-primary dark:text-blue-400 font-semibold">
                Login
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}