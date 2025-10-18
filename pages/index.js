// pages/Index.js
import Head from "next/head";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection"; // ✅ Updated import name
import Footer from "../components/Footer";
import Link from "next/link";

export default function Home() {
  const features = [
    {
      title: "Simple",
      desc: "Post a wish in under 60 seconds and connect instantly with potential donors.",
      icon: "✨",
    },
    {
      title: "Trustworthy",
      desc: "Every request is carefully verified before going public to ensure authenticity.",
      icon: "🔒",
    },
    {
      title: "Secure",
      desc: "We handle all transactions safely through encrypted payment systems.",
      icon: "💰",
    },
  ];

  return (
    <>
      <Head>
        <title>WishhoffRichies — Turn Wishes Into Reality</title>
        <meta
          name="description"
          content="WishhoffRichies connects generous donors with real people who need a helping hand. Make an impact by turning wishes into reality."
        />
        <meta
          name="keywords"
          content="wish platform, donations, help, generosity, crowdfunding, support"
        />
        <meta name="author" content="WishhoffRichies Team" />
      </Head>

      {/* ✅ Global Navbar */}
      <Navbar />

      {/* ✅ Hero Section */}
      <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-black transition-colors duration-500">
        <HeroSection />

        {/* ✅ Features Section */}
        <section className="container mx-auto px-6 py-20 grid gap-10 md:grid-cols-3 text-center">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800 rounded-2xl p-10 shadow-md hover:shadow-xl border border-slate-200 dark:border-slate-700 transform hover:-translate-y-1 transition duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h4 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                {feature.title}
              </h4>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </section>

        {/* ✅ CTA Section */}
        <section className="text-center py-20 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-3xl shadow-lg mx-6 md:mx-20 my-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to make a difference?
          </h2>
          <p className="text-lg mb-6">
            Start by posting a wish or fulfilling one today — small acts can create huge changes.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/post-wish"
              className="bg-white text-purple-700 px-6 py-3 rounded-full font-semibold hover:bg-slate-200 transition"
            >
              Post a Wish
            </Link>
            <Link
              href="/browse-wishes"
              className="bg-transparent border border-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-purple-700 transition"
            >
              Browse Wishes
            </Link>
          </div>
        </section>
      </main>

      {/* ✅ Global Footer */}
      <Footer />
    </>
  );
}