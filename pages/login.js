"use client";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";
import Head from "next/head";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // ✅ Redirect registered user to Explore or Dashboard
      router.push("/explore");
    } catch (err) {
      console.error("Login error:", err.message);
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = () => {
    router.push("/donate-as-guest");
  };

  return (
    <>
      <Head>
        <title>Login | LightTech Wishes</title>
      </Head>

      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-900 px-6">
        <div className="bg-white dark:bg-slate-800 shadow-xl rounded-2xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-center text-primary dark:text-blue-400 mb-6">
            Welcome Back 💫
          </h1>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
                placeholder="Enter your password"
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
              {loading ? "Signing In..." : "Login"}
            </button>
          </form>

          <div className="text-center mt-6 text-sm text-slate-500 dark:text-slate-400">
            <p>
              Don’t have an account?{" "}
              <Link href="/signup" className="text-primary dark:text-blue-400 font-semibold">
                Sign Up
              </Link>
            </p>
          </div>

          <div className="flex items-center justify-center mt-6">
            <span className="text-xs text-slate-400">or</span>
          </div>

          <button
            onClick={handleGuest}
            className="w-full py-3 mt-4 rounded-lg border border-primary text-primary dark:text-blue-400 hover:bg-primary/10 transition font-semibold"
          >
            Donate as Guest
          </button>
        </div>
      </main>
    </>
  );
}