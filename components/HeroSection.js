import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1E3A8A] via-[#243B88] to-[#0F1F4B] text-white py-24">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
        {/* LEFT SIDE — Text Content */}
        <div className="flex-1 max-w-lg">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-5">
            Turn{" "}
            <span className="text-blue-300 drop-shadow-sm">Wishes</span> into{" "}
            <span className="text-yellow-300">Reality</span> 💫
          </h1>

          <p className="text-lg text-blue-100/90 mb-8 leading-relaxed">
            WishhoffRichies connects kind donors with real people in need —
            making giving safe, transparent, and beautifully human.
          </p>

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
            className="max-w-sm w-full drop-shadow-2xl hover:scale-[1.03] transition-transform duration-500"
          />
        </div>
      </div>

      {/* Floating Glow Backgrounds */}
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-10 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl"></div>

      {/* Scroll Indicator */}
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </div>
      </div>

      <style jsx>{`
        .btn-primary {
          background: linear-gradient(90deg, #ffffff 0%, #f8f9ff 100%);
          color: #1e3a8a;
          font-weight: 600;
          padding: 12px 26px;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(255, 255, 255, 0.15);
          transition: all 0.3s ease;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          background: #eaf0ff;
        }

        .btn-outline {
          border: 2px solid #fff;
          color: #fff;
          font-weight: 600;
          padding: 12px 26px;
          border-radius: 10px;
          transition: all 0.3s ease;
        }
        .btn-outline:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }
      `}</style>
    </section>
  );
}