"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabaseClient";

export default function GuestDashboard() {
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDonation() {
      try {
        // Try getting the latest donation info from localStorage
        const stored = localStorage.getItem("guestDonation");
        if (stored) {
          const parsed = JSON.parse(stored);
          setDonation(parsed);

          // Optional: try fetching latest status from Supabase
          const { data, error } = await supabase
            .from("payments")
            .select("wish_id, amount, currency, status, reference")
            .eq("reference", parsed.reference)
            .single();

          if (!error && data) setDonation({ ...parsed, ...data });
        }
      } catch (err) {
        console.error("Failed to load donation info:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDonation();
  }, []);

  return (
    <>
      <Head>
        <title>Guest Donation Summary | WishhoffRichies</title>
      </Head>
      <Navbar />

      <main className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 p-6">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 shadow-xl rounded-xl p-6 text-center">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
            🎉 Thank You for Your Donation!
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Your generosity helps make wishes come true.
          </p>

          {loading ? (
            <p className="text-slate-500 dark:text-slate-400">Loading summary…</p>
          ) : donation ? (
            <div className="p-4 border border-slate-200 dark:border-slate-700 rounded mb-6 text-left">
              <p className="font-semibold text-slate-800 dark:text-slate-100 mb-1">
                Wish ID: {donation.wish_id || "Unknown"}
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                Amount Donated:{" "}
                <strong>
                  {donation.currency || "NGN"} {donation.amount}
                </strong>
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                Reference: <strong>{donation.reference}</strong>
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                Status:{" "}
                <span
                  className={`font-semibold ${
                    donation.status === "success"
                      ? "text-green-600"
                      : donation.status === "pending"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  {donation.status || "unknown"}
                </span>
              </p>
            </div>
          ) : (
            <div className="p-4 border border-slate-200 dark:border-slate-700 rounded mb-6">
              <p>No donations recorded yet.</p>
            </div>
          )}

          <Link
            href="/"
            className="text-primary hover:underline font-medium block"
          >
            ← Back to Home
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}
