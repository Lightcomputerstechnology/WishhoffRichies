// pages/guest-dashboard.jsx
import Link from "next/link";
import Head from "next/head";

export default function GuestDashboard() {
  return (
    <>
      <Head>
        <title>Guest Donation Summary | WishhoffRichies</title>
      </Head>

      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-900 p-6">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 shadow-xl rounded-xl p-6 text-center">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
            🎉 Thank You for Your Donation!
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Your generosity helps make wishes come true. You can track your donation below.
          </p>

          {/* You can expand this to pull guest donation info from localStorage or Supabase */}
          <div className="p-4 border border-slate-200 dark:border-slate-700 rounded mb-6">
            <p>No donations recorded yet.</p>
          </div>

          <Link href="/" className="text-primary hover:underline">
            ← Back to Home
          </Link>
        </div>
      </main>
    </>
  );
}
