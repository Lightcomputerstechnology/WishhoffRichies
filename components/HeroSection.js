// components/HeroSection.js
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-[#0b3d91] via-[#2563eb] to-[#0f172a] text-white py-24">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
        {/* LEFT SIDE — Hero Text */}
        <div className="flex-1 max-w-lg text-center md:text-left animate-fade-up">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 drop-shadow-lg">
            Turn <span className="text-accent">Wishes</span> into Reality
          </h1>
          <p className="text-lg text-light/90 mb-8 leading-relaxed">
            A secure and human platform where verified donors fund honest needs —
            with transparency and heart.
          </p>

          {/* Hero Buttons */}
          <div className="flex gap-6 justify-center md:justify-start flex-wrap md:flex-nowrap">
            <Link
              href="/wish/new"
              className="bg-light text-primary font-bold px-10 py-4 rounded-lg shadow-lg hover:bg-accent hover:text-white transition w-full md:w-auto text-center"
            >
              Make a Wish
            </Link>
            <Link
              href="/explore"
              className="border-2 border-light text-light font-bold px-10 py-4 rounded-lg shadow-lg hover:bg-light hover:text-primary transition w-full md:w-auto text-center"
            >
              Browse Wishes
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE — Placeholder for illustration or additional content */}
        <div className="flex-1 max-w-[85%] mx-auto">
          {/* You can optionally add an illustration here */}
        </div>
      </div>
    </section>
  );
}
