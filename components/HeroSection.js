"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function HeroSection() {
  // Dynamic featured wishes
  const featuredWishes = [
    {
      title: "School Fees for Ada",
      progress: 62,
      raised: 620,
      goal: 1000,
    },
    {
      title: "Medical Help for Chike",
      progress: 45,
      raised: 450,
      goal: 1000,
    },
    {
      title: "Startup Support for Ifeoma",
      progress: 80,
      raised: 800,
      goal: 1000,
    },
    {
      title: "House Rent for Tunde",
      progress: 30,
      raised: 300,
      goal: 1000,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredWishes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [featuredWishes.length]);

  const currentWish = featuredWishes[currentIndex];

  return (
    <header className="container mx-auto px-6 py-20 text-center md:text-left transition-all duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-12">
        {/* LEFT SIDE — Text Content */}
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-slate-900 dark:text-white">
            Turn your <span className="text-primary">Wishes</span> into Reality ✨
          </h1>
          <p className="mt-5 text-lg text-slate-700 dark:text-slate-300 max-w-md">
            A secure and human platform where verified donors fund honest needs —
            with transparency and heart.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link
              href="/wish/new"
              className="px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition"
            >
              Make a Wish
            </Link>
            <Link
              href="/explore"
              className="px-6 py-3 rounded-lg border border-primary text-primary font-medium hover:bg-primary hover:text-white transition"
            >
              Browse Wishes
            </Link>
          </div>

          <ul className="mt-6 space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li>• Manual moderation for high-value requests</li>
            <li>• Secure payments via Stripe</li>
            <li>• Transparent donation tracking</li>
          </ul>
        </div>

        {/* RIGHT SIDE — Animated Featured Wish */}
        <div className="flex-1 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700 relative overflow-hidden">
          <div
            key={currentIndex}
            className="transition-all duration-700 ease-in-out transform animate-slideIn"
          >
            <h4 className="text-primary font-semibold mb-2">Featured Wish</h4>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {currentWish.title}
            </h3>

            <div className="mt-3 bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
              <div
                style={{ width: `${currentWish.progress}%` }}
                className="bg-primary h-3 rounded-full transition-all"
              ></div>
            </div>

            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
              ${currentWish.raised} raised of ${currentWish.goal} goal
            </p>

            <Link
              href="/explore"
              className="mt-4 inline-block px-5 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition"
            >
              View Wishes
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          0% {
            opacity: 0;
            transform: translateX(40px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.7s ease-in-out;
        }
        .text-primary {
          color: #1e3a8a;
        }
        .bg-primary {
          background-color: #1e3a8a;
        }
      `}</style>
    </header>
  );
}
