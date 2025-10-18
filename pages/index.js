// pages/Index.js
import Head from "next/head";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection"; // ✅ Imported Hero section correctly
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

      {/* ✅ Imported Hero Section */}
      <HeroSection />

      {/* ✅ Features Section */}
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