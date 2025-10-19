import Link from "next/link";

export default function HeroSection() {
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

          <div className="flex flex-wrap gap-6 justify-center md:justify-start">
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
        <div className="flex-1 max-w-md bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700 animate-fade-up">
          <h4 className="text-primary font-semibold mb-2">Featured Wish</h4>
          <h3 className="text-lg font-bold text-dark dark:text-light">
            School Fees for Ada
          </h3>

          <div className="mt-3 bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
            <div
              style={{ width: "62%" }}
              className="bg-primary h-3 rounded-full transition-all"
            ></div>
          </div>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            $620 raised of $1000 goal
          </p>

          <Link
            href="/explore"
            className="mt-4 inline-block px-5 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition"
          >
            View Wishes
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
    </section>
  );
}
