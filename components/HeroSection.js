import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0b3d91] via-[#2563eb] to-[#0f172a] text-white py-24">
      <div className="container mx-auto px-6 flex flex-col items-center justify-center text-center gap-10">
        {/* CENTERED TEXT */}
        <div className="max-w-2xl animate-fade-up">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 drop-shadow-lg">
            Turn <span className="text-accent">Wishes</span> into Reality ✨
          </h1>

          <p className="text-lg text-light/90 mb-8 leading-relaxed">
            WishhoffRichies connects kind donors with real people in need —
            safe, transparent, and human-first giving for all.
          </p>

          <div className="flex flex-wrap gap-6 justify-center">
            <Link
              href="/wish/new"
              className="bg-light text-primary font-bold px-8 py-4 rounded-lg hover:bg-accent hover:text-white transition shadow-lg"
            >
              🌠 Make a Wish
            </Link>
            <Link
              href="/explore"
              className="border-2 border-light text-light font-bold px-8 py-4 rounded-lg hover:bg-light hover:text-primary transition shadow-lg"
            >
              🌍 Browse Wishes
            </Link>
          </div>
        </div>

        {/* SMOOTH SLIDING FEATURED WISHES */}
        <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700">
          <div className="relative overflow-hidden">
            <div className="inline-flex animate-marquee hover:pause">
              {[
                { title: "School Fees for Ada", raised: 620, goal: 1000 },
                { title: "Medical Help for Chinedu", raised: 420, goal: 800 },
                { title: "Food Support for Ngozi", raised: 950, goal: 950 },
                { title: "Rent Aid for Musa", raised: 200, goal: 600 },
              ].map((wish, i) => (
                <div
                  key={i}
                  className="inline-block w-full px-6 py-6 text-center align-top"
                >
                  <h4 className="text-primary font-semibold mb-1">
                    Featured Wish
                  </h4>
                  <h3 className="text-lg font-bold text-dark dark:text-light">
                    {wish.title}
                  </h3>

                  <div className="mt-3 bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                    <div
                      style={{ width: `${(wish.raised / wish.goal) * 100}%` }}
                      className="bg-primary h-3 rounded-full transition-all"
                    ></div>
                  </div>

                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    ${wish.raised} raised of ${wish.goal} goal
                  </p>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/explore"
            className="block mt-2 mb-4 text-center text-primary font-semibold hover:text-accent transition"
          >
            View All Wishes →
          </Link>
        </div>
      </div>

      {/* SCROLL INDICATOR */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="text-light/80 text-sm flex flex-col items-center">
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
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-400%);
          }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 40s linear infinite;
        }
        .hover\\:pause:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
