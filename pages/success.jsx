"use client";
import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function SuccessPage() {
  return (
    <>
      <Head>
        <title>Donation Successful | LightTech</title>
      </Head>

      <Navbar />

      <main className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <div className="bg-white dark:bg-slate-800 p-10 rounded-2xl shadow-lg max-w-lg">
          <h1 className="text-4xl font-extrabold text-green-500 mb-3">
            🎉 Thank You!
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-4">
            Your donation has been received successfully. <br />
            You’re helping make a real difference!
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-center">
            <Link
              href="/explore"
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
            >
              Explore More Wishes
            </Link>
            <Link
              href="/profile"
              className="border border-slate-400 text-slate-700 dark:text-slate-200 px-6 py-3 rounded-lg font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            >
              View Your Donations
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
