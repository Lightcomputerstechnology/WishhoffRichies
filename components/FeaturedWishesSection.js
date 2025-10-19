// components/FeaturedWishesSection.js
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const featuredWishes = [
  { name: "School Fees for Ada", raised: 620, goal: 1000 },
  { name: "Medical Support for Chika", raised: 340, goal: 500 },
  { name: "Books for Jide", raised: 180, goal: 200 },
  { name: "Community Well", raised: 750, goal: 1000 },
  { name: "Food Supplies for Ngozi", raised: 420, goal: 500 },
  { name: "Laptop for Students", raised: 1500, goal: 2000 },
  { name: "Clothing Support", raised: 300, goal: 400 },
  { name: "Emergency Relief Fund", raised: 900, goal: 1200 },
];

export default function FeaturedWishesSection() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <section className="py-16 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-12">
          Featured Wishes
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {featuredWishes.map((wish, i) => (
            <div
              key={i}
              data-aos={i % 2 === 0 ? "fade-right" : "fade-left"}
              className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl shadow-xl border-4 border-slate-300 dark:border-slate-700"
            >
              <h3 className="text-xl font-bold text-primary mb-2">{wish.name}</h3>
              <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden mb-2">
                <div
                  style={{ width: `${(wish.raised / wish.goal) * 100}%` }}
                  className="bg-primary h-3 rounded-full transition-all duration-700"
                ></div>
              </div>
              <p className="text-slate-700 dark:text-slate-300">
                ${wish.raised} raised of ${wish.goal} goal
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
