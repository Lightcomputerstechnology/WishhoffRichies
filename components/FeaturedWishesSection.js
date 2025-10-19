// components/FeaturedWishesSection.js
import Link from "next/link";

const wishes = [
  { title: "School Fees for Ada", raised: 620, goal: 1000 },
  { title: "Medical Help for John", raised: 450, goal: 800 },
  { title: "New Books for Library", raised: 300, goal: 500 },
  { title: "Community Clean-Up", raised: 200, goal: 400 },
  { title: "Laptop for Student", raised: 750, goal: 1000 },
  { title: "Orphanage Supplies", raised: 400, goal: 700 },
];

export default function FeaturedWishesSection() {
  return (
    <section className="container mx-auto px-6 py-16 grid md:grid-cols-3 gap-8">
      {wishes.map((wish, i) => {
        const percentage = Math.min((wish.raised / wish.goal) * 100, 100);
        return (
          <div
            key={i}
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-2xl border-2 border-slate-200 dark:border-slate-700 transition transform hover:-translate-y-2"
          >
            <h4 className="text-primary font-semibold mb-2">Featured Wish</h4>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {wish.title}
            </h3>
            <div className="mt-3 bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
              <div
                style={{ width: `${percentage}%` }}
                className="bg-primary h-3 rounded-full transition-all"
              ></div>
            </div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              ${wish.raised} raised of ${wish.goal} goal
            </p>
            <Link
              href="/explore"
              className="mt-4 inline-block px-5 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition font-medium"
            >
              View Wishes
            </Link>
          </div>
        );
      })}
    </section>
  );
}
