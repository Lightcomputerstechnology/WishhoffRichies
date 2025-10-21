// pages/donate/guest.jsx
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function DonateAsGuest() {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    // If this page is accessed without an id, redirect back to donation list or home
    if (!id) {
      const timeout = setTimeout(() => router.replace("/donate"), 2000);
      return () => clearTimeout(timeout);
    }
  }, [id]);

  const continueAsGuest = () => {
    if (!id) return alert("Missing donation target.");
    router.push(`/checkout/${id}?guest=true`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 p-6">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 shadow-xl rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
          Donate as Guest
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          You can continue your donation without creating an account. <br />
          Please note that you won’t be able to track your donation history later.
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={continueAsGuest}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            Continue to Checkout
          </button>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    </main>
  );
}
