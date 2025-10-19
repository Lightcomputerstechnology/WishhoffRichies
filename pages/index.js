import Head from "next/head";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection"; // ✅ Imported Hero section correctly
import Footer from "../components/Footer";

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
            className="bg-[#0b3d91] dark:bg-[#111827] p-8 rounded-xl shadow-lg border-2 border-[#2563eb] hover:shadow-2xl transition flex flex-col justify-between"
          >
            <h4 className="text-accent font-bold text-lg mb-2">
              {feature.title}
            </h4>
            <p className="text-light/90 text-sm leading-relaxed">
              {feature.desc}
            </p>
          </div>
        ))}
      </section>

      <Footer />
    </>
  );
}
