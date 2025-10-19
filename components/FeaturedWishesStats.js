// components/FeaturedWishesStats.js
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const statsData = [
  { label: "Pending Wishes", value: 210 },
  { label: "Completed Wishes", value: 1240 },
  { label: "Donors Active", value: 532 },
  { label: "Funds Raised ($)", value: 56000 },
];

function useCountUp(target, duration = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 30);
    const interval = setInterval(() => {
      start += increment;
      if (start >= target) {
        start = target;
        clearInterval(interval);
      }
      setCount(Math.floor(start));
    }, 30);

    return () => clearInterval(interval);
  }, [target, duration]);

  return count;
}

export default function FeaturedWishesStats() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true, offset: 50 });
  }, []);

  return (
    <section className="py-16 bg-slate-100 dark:bg-slate-800 overflow-x-hidden">
      <div className="container mx-auto px-6 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        {statsData.map((stat, i) => {
          const count = useCountUp(stat.value);

          // Format Funds Raised with commas
          const displayValue =
            stat.label.includes("Funds Raised") ? `$${count.toLocaleString()}` : count;

          return (
            <div
              key={i}
              data-aos="fade-up"
              className="card p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 transition-transform hover:scale-105"
            >
              <h3 className="text-3xl font-bold text-primary mb-2">{displayValue}</h3>
              <p className="text-slate-700 dark:text-slate-300 font-medium">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}