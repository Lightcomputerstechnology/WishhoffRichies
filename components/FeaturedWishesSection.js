// components/FeaturedWishesSection.js
import Link from "next/link";

const featuredWishes = [
  { title: "School Fees for Ada", raised: 620, goal: 1000 },
  { title: "Medical Support for Chika", raised: 450, goal: 800 },
  { title: "Books for Students", raised: 300, goal: 500 },
  { title: "Community Feeding Program", raised: 780, goal: 1000 },
  { title: "Sports Equipment Donation", raised: 250, goal: 600 },
  { title: "Clean Water Project", raised: 900, goal: 1200 },
];

export default function FeaturedWishesSection() {
  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-12">
          Featured Wishes
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {featuredWishes.map((wish, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 150} // stagger effect
              className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border-2 border-slate-200 dark:border-slate-700 transition hover:shadow-xl"
            >
              <h4 className="text-primary font-semibold mb-2">{wish.title}</h4>
              <div className="mt-3 bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                <div
                  style={{ width: `${(wish.raised / wish.goal) * 100}%` }}
                  className="bg-primary h-3 rounded-full transition-all"
                ></div>
              </div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                ${wish.raised} raised of ${wish.goal} goal
              </p>
              <Link
                href="/explore"
                className="mt-4 inline-block px-5 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition"
              >
                View Wishes
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
