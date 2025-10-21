"use client";
import Head from "next/head";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ChooseDonationFlow() {
  const router = useRouter();
  const { id } = router.query;

  const handleLogin = () => {
    if (!id) return;
    // Redirect to login with a redirect parameter
    router.push(`/auth?redirect=/checkout/${id}`);
  };

  const handleGuest = () => {
    if (!id) return;
    // Go to guest donation page
    router.push(`/donate-as-guest?id=${id}`);
  };

  return (
    <>
      <Head>
        <title>Choose Donation Flow | WishhoffRichies</title>
      </Head>
      <Navbar />

      <main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
        <div className="bg-white dark:bg-slate-800 max-w-md w-full p-8 rounded-2xl shadow-md text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            How would you like to donate?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Please select how you wish to continue with your donation.
          </p>

          <div className="flex flex-col gap-3 mt-6">
            <button
              onClick={handleLogin}
              className="w-full py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition"
            >
              Sign In / Create Account
            </button>

            <button
              onClick={handleGuest}
              className="w-full py-3 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition"
            >
              Continue as Guest
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
