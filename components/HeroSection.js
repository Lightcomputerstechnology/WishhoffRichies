import Link from "next/link";
import { useEffect, useState } from "react";

export default function HeroSection() {
  const sampleWishes = [
    "🎓 School Fees for Ada",
    "🏠 Rent Support for Chidi",
    "🛍 Business Startup for Joy",
    "💊 Medical Bill for Mama Peace",
    "📚 Exam Registration for Daniel",
    "💡 Electricity Bill for Ngozi",
  ];
  const [currentWish, setCurrentWish] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWish((prev) => (prev + 1) % sampleWishes.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#1E3A8A] to-[#0F1F4B] text-white py-24">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">
        {/* LEFT SIDE — Text */}
        <div className="flex-1 max-w-lg">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 text-white drop-shadow-lg">
            Turn <span className="text-blue-300">Wishes</span> into Reality 💫
          </h1>

          <p className="text-lg text-gray-100 mb-8 leading-relaxed">
            WishhoffRichies connects kind donors with real people in need —
            safe, transparent, and human-first giving for all.
          </p>

          {/* Animated Wish Examples */}
          <div className="relative h-10 overflow-hidden mb-8">
            <p
              key={currentWish}
              className="absolute w-full text-xl font-semibold text-blue-200 animate-fade-slide"
            >
              {sampleWishes[currentWish]}
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link href="/wish/new" className="btn-primary">
              🌠 Make a Wish
            </Link>
            <Link href="/explore" className="btn-outline">
              🌍 Browse Wishes
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE — Illustration */}
        <div className="flex-1 flex justify-center">
          <img
            src="/hero-illustration.svg"
            alt="People granting wishes illustration"
            className="max-w-sm w-full drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="text-blue-100 text-sm flex flex-col items-center">
          <span>Scroll to explore</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 mt-1"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>

      <style jsx>{`
        .btn-primary {
          background: #fff;
          color: #1e3a8a;
          font-weight: 600;
          padding: 10px 22px;
          border-radius: 8px;
          transition: 0.3s;
        }
        .btn-primary:hover {
          background: #f0f3ff;
        }

        .btn-outline {
          border: 2px solid #fff;
          color: #fff;
          padding: 10px 22px;
          border-radius: 8px;
          transition: 0.3s;
        }
        .btn-outline:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        @keyframes fadeSlide {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          20% {
            opacity: 1;
            transform: translateY(0);
          }
          80% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-10px);
          }
        }
        .animate-fade-slide {
          animation: fadeSlide 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
