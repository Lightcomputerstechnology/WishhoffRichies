import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>WishhoffRichies — Turn wishes into reality</title>
        <meta
          name="description"
          content="WishhoffRichies connects generous donors with real people who need a helping hand."
        />
      </Head>

      <Navbar />

      {/* Hero Section */}
      <header className="container mx-auto px-6 py-16 text-center md:text-left">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-12">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-slate-800 dark:text-slate-100">
              Turn wishes into reality ✨
            </h1>
            <p className="mt-5 text-lg text-slate-600 dark:text-slate-300 max-w-md">
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

            <ul className="mt-6 space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li>• Manual moderation for high-value requests</li>
              <li>• Secure payments via Stripe</li>
              <li>• Transparent donation tracking</li>
            </ul>
          </div>

          {/* Featured Wish Card */}
          <div className="flex-1 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700">
            <h4 className="text-primary font-semibold mb-2">Featured Wish</h4>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
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
              className="mt-4 inline-block px-5 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition"
            >
              View Wishes
            </Link>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16 grid md:grid-cols-3 gap-8">
        {[
          {
            title: "Simple",
            desc: "Post a wish in under 60 seconds.",
          },
          {
            title: "Trustworthy",
            desc: "Every request is verified before public listing.",
          },
          {
            title: "Secure",
            desc: "Payments handled safely through Stripe & Supabase.",
          },
        ].map((feature, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm hover:shadow-md border border-slate-100 dark:border-slate-700 transition"
          >
            <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              {feature.title}
            </h4>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              {feature.desc}
            </p>
          </div>
        ))}
      </section>

      <Footer />
    </>
  );
}