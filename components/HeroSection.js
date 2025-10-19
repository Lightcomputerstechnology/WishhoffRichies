import { useState, useEffect } from "react";
import Link from "next/link";

const featuredWishes = [
  {
    title: "School Fees for Ada",
    raised: 620,
    goal: 1000,
  },
  {
    title: "Medical Bill for Emeka",
    raised: 430,
    goal: 800,
  },
  {
    title: "Books for Chiamaka",
    raised: 150,
    goal: 500,
  },
];

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!paused) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % featuredWishes.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [paused]);

  return (
    <section className="relative bg-gradient-to-b from-[#0b3d91] via-[#2563eb] to-[#0f172a] text-white py-24">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
        {/* LEFT SIDE — Text */}
        <div className="flex-1 max-w-lg text-center md:text-left animate-fade-up">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 drop-shadow-lg">
            Turn <span className="text-accent">Wishes</span> into Reality
          </h1>

          <p className="text-lg text-light/90 mb-8 leading-relaxed">
            A secure and human platform where verified donors fund honest needs —
            with transparency and heart.
          </p>

          {/* Buttons side by side */}
          <div className="flex gap-6 justify-center md:justify-start">
            <Link
              href="/wish/new"
              className="bg-light text-primary font-bold px-8 py-4 rounded-lg shadow-lg hover:bg-accent hover:text-white transition"
            >
              Make a Wish
            </Link>
            <Link
              href="/explore"
              className="border-2 border-light text-light font-bold px-8 py-4 rounded-lg shadow-lg hover:bg-light hover:text-primary transition"
            >
              Browse Wishes
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE — Featured Wish Card */}
        <div
          className="flex-1 max-w-[85%] mx-auto" // reduced width slightly and centralized
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            className="flex transition-transform duration-1000 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {featuredWishes.map((wish, idx) => (
              <div
                key={idx}
                className="min-w-full bg-white dark:bg-slate-800 p-6 border-y-4 border-x-2 border-primary rounded-2xl shadow-md flex flex-col justify-between mx-auto"
              >
                <h4 className="text-primary font-semibold mb-2">Featured Wish</h4>
                <h3 className="text-lg font-bold text-dark dark:text-light">{wish.title}</h3>

                <div className="mt-3 bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div
                    style={{
                      width: `${(wish.raised / wish.goal) * 100}%`,
                      transition: "width 1.5s ease-in-out",
                    }}
                    className="bg-primary h-3 rounded-full"
                  ></div>
                </div>

                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  ${wish.raised} raised of ${wish.goal} goal
                </p>

                <Link
                  href="/explore"
                  className="mt-4 inline-block px-5 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition"
                >
                  View Wishes
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
