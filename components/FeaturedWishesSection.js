import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import DonateButton from "./DonateButton"; // ✅ use the unified payment button

// ✅ You can later fetch these dynamically from Supabase if needed
const featuredWishes = [
  { id: "f1", name: "Ada Johnson", title: "School Fees", raised: 620, goal: 1000, verified: true, location: "Lagos", image: "/sample1.jpg" },
  { id: "f2", name: "Chika Okafor", title: "Medical Support", raised: 340, goal: 500, verified: false, location: "Abuja", image: "/sample2.jpg" },
  { id: "f3", name: "Jide Adebayo", title: "Books", raised: 180, goal: 200, verified: true, location: "Port Harcourt", image: "/sample3.jpg" },
  { id: "f4", name: "Community Well", title: "Well Project", raised: 750, goal: 1000, verified: true, location: "Kano", image: "/sample4.jpg" },
  { id: "f5", name: "Ngozi Eze", title: "Food Supplies", raised: 420, goal: 500, verified: false, location: "Enugu", image: "/sample5.jpg" },
  { id: "f6", name: "Students Group", title: "Laptop Fund", raised: 1500, goal: 2000, verified: true, location: "Lagos", image: "/sample6.jpg" },
];

export default function FeaturedWishesSection() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true, offset: 50 });
  }, []);

  return (
    <section className="py-16 bg-gradient-to-b from-[#f8fafc] to-[#e2e8f0] dark:from-slate-900 dark:to-slate-800 overflow-x-hidden">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-12">
          Featured Wishes
        </h2>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {featuredWishes.map((wish, i) => {
            const progress = Math.min((wish.raised / wish.goal) * 100, 100);
            return (
              <div
                key={wish.id}
                data-aos={i % 2 === 0 ? "fade-right" : "fade-left"}
                className="relative p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-300 dark:border-slate-700 max-w-full box-border transition-transform hover:scale-105"
              >
                {wish.verified && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    ✅ Verified
                  </div>
                )}

                <img
                  src={wish.image}
                  alt={wish.title}
                  className="w-full h-40 object-cover rounded-xl mb-4"
                />

                <h3 className="text-xl font-bold text-primary dark:text-blue-400 mb-1">
                  {wish.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                  By {wish.name} • {wish.location}
                </p>

                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden mb-2">
                  <div
                    style={{ width: `${progress}%` }}
                    className={`h-3 ${
                      progress >= 100
                        ? "bg-green-500"
                        : "bg-primary dark:bg-blue-400"
                    } transition-all duration-500`}
                  ></div>
                </div>

                <p className="text-slate-700 dark:text-slate-300 mb-4">
                  ${wish.raised} raised of ${wish.goal} goal
                </p>

                {/* ✅ Use the new unified DonateButton */}
                <DonateButton wishId={wish.id} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}