import Link from "next/link";

export default function WishCard({ wish }) {
  const shortDesc =
    wish.description?.length > 120
      ? wish.description.slice(0, 120) + "…"
      : wish.description;

  return (
    <article className="bg-white dark:bg-slate-800 shadow-md rounded-xl p-5 flex flex-col justify-between hover:shadow-lg transition-all duration-200">
      <div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 line-clamp-2 mb-2">
          {wish.title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-3">
          {shortDesc}
        </p>

        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden mb-3">
          <div
            className="bg-primary h-2 rounded-full"
            style={{ width: `${Math.min((wish.raised_amount / wish.amount) * 100 || 0, 100)}%` }}
          ></div>
        </div>

        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-4">
          <span>
            ${wish.raised_amount || 0} raised of ${wish.amount}
          </span>
        </div>
      </div>

      <Link
        href={`/wish/${wish.id}`}
        className="inline-block text-center bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition"
      >
        View & Donate
      </Link>
    </article>
  );
}