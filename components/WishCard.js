"use client";
import Link from "next/link";

export default function WishCard({ wish }) {
  const fulfilled = wish.fulfilled || 0;
  const progress = Math.min((fulfilled / wish.amount) * 100, 100);
  const isFulfilled = fulfilled >= wish.amount;

  return (
    <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden flex flex-col transition hover:shadow-xl">
      {/* Wish Image */}
      <div className="relative w-full h-40">
        <img
          src={wish.image || "/placeholder.jpg"}
          alt={wish.title}
          className="w-full h-full object-cover"
        />
        {/* Verified Badge */}
        {wish.verified && (
          <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            ✅ Verified
          </span>
        )}
        {/* Fulfilled Badge */}
        {isFulfilled && (
          <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
            🎉 Fulfilled
          </div>
        )}
      </div>

      {/* Wish Info */}
      <div className="p-6 flex flex-col flex-1 justify-between">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-primary dark:text-blue-400 mb-2">{wish.title}</h3>
          <p className="text-slate-700 dark:text-slate-300 mb-2 line-clamp-3">{wish.description}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Requested by <span className="font-medium">{wish.name}</span>
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mt-auto flex flex-col gap-2">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            🎯 Amount Needed: <span className="text-primary dark:text-blue-400">${wish.amount}</span>
          </p>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 ${isFulfilled ? "bg-green-500" : "bg-primary dark:bg-blue-400"} transition-all duration-500`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {fulfilled} / {wish.amount} fulfilled
          </p>

          {/* Action Buttons */}
          <Link href={`/wish/${wish.id}`}>
            <button className="w-full py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition font-semibold">
              View Wish
            </button>
          </Link>

          {!isFulfilled && wish.amount > 0 && (
            <Link href={`/donate/${wish.id}`}>
              <button className="w-full py-2 rounded-lg border border-primary text-primary dark:text-blue-400 hover:bg-primary/10 dark:hover:bg-blue-900 transition font-semibold">
                Donate
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}