import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#1E3A8A] to-[#0F1F4B] text-white py-24">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
        {/* LEFT SIDE — Text */}
        <div className="flex-1 max-w-xl text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 drop-shadow-lg">
            Turn <span className="text-blue-200">Wishes</span> into Reality 💫
          </h1>
          <p className="text-lg text-blue-100 mb-8 leading-relaxed">
            WishhoffRichies connects kind donors with real people in need — safe,
            transparent, and human-first giving for all.
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-4">
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
            className="max-w-sm w-full drop-shadow-2xl animate-fadeIn"
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
          background: #ffffff;
          color: #1e3a8a;
          font-weight: 600;
          padding: 10px 22px;
          border-radius: 8px;
          transition: all 0.3s ease;
          box-shadow: 0 2px 6px rgba(255, 255, 255, 0.2);
        }
        .btn-primary:hover {
          background: #f0f3ff;
          transform: translateY(-2px);
        }

        .btn-outline {
          border: 2px solid #ffffff;
          color: #ffffff;
          padding: 10px 22px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        .btn-outline:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 1.2s ease forwards;
        }
      `}</style>
    </section>
  );
}