"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

export default function WishCard({ wish }) {
  const router = useRouter();
  const fulfilled =
    wish.fulfilled || Math.floor(Math.random() * (wish.amount + 1)); // For mock progress
  const progress = Math.min((fulfilled / wish.amount) * 100, 100);
  const isFulfilled = fulfilled >= wish.amount;

  const timeAgo = wish.created_at
    ? formatDistanceToNow(new Date(wish.created_at), { addSuffix: true })
    : "Just now";

  const handleDonate = () => {
    // Detect mock by checking if there's no real Supabase id pattern
    const isMock = wish.id?.startsWith("m") || wish.isMock;
    const query = new URLSearchParams({
      id: wish.id,
      mock: isMock ? "1" : "0",
    }).toString();
    router.push(`/donate?${query}`);
  };

  return (
    <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-lg flex flex-col transition hover:shadow-xl overflow-hidden">
      {/* Wish image */}
      {wish.image && (
        <img
          src={wish.image}
          alt={wish.title}
          className="w-full h-40 object-cover rounded-t-2xl"
        />
      )}

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-primary dark:text-blue-400">
            {wish.title}
          </h3>
          {wish.verified && (
            <span className="bg-green-500 text-white px-2 py-1 text-xs rounded-full font-semibold">
              ✅ Verified
            </span>
          )}
        </div>

        <p className="text-slate-700 dark:text-slate-300 mb-2">
          {wish.description}
        </p>

        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
          Requested by <span className="font-medium">{wish.name}</span>
        </p>
        {wish.location && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
            📍 {wish.location}
          </p>
        )}
        <p className="text-xs text-slate-400 mb-2">{timeAgo}</p>

        <div className="mt-auto flex flex-col gap-2">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            🎯 Amount Needed:{" "}
            <span className="text-primary dark:text-blue-400">
              ${wish.amount}
            </span>
          </p>

          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 ${
                isFulfilled
                  ? "bg-green-500"
                  : "bg-primary dark:bg-blue-400"
              } transition-all duration-500`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {fulfilled} / {wish.amount} fulfilled
          </p>

          <Link href={`/wish/${wish.id}`}>
            <button className="w-full py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition font-semibold">
              View Wish
            </button>
          </Link>

          {!isFulfilled && wish.amount > 0 && (
            <button
              onClick={handleDonate}
              className="w-full py-2 rounded-lg border border-primary text-primary dark:text-blue-400 hover:bg-primary/10 dark:hover:bg-blue-900 transition font-semibold"
            >
              Donate
            </button>
          )}
        </div>
      </div>

      {isFulfilled && (
        <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
          ✅ Fulfilled
        </div>
      )}
    </div>
  );
}
