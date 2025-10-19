// pages/index.js
import Head from "next/head";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection"; 
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
      <HeroSection />

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
            className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-md border-2 border-slate-200 dark:border-slate-700 transition transform hover:-translate-y-2"
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

      {/* Featured Wishes Carousel */}
      <section className="bg-slate-100 dark:bg-slate-900 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-slate-800 dark:text-slate-100">
            Featured Wishes
          </h2>

          <div className="flex flex-wrap justify-center gap-6">
            {[
              { title: "School Fees for Ada", progress: 62, raised: 620, goal: 1000 },
              { title: "Medical Support for John", progress: 40, raised: 400, goal: 1000 },
              { title: "Books for Charity", progress: 80, raised: 800, goal: 1000 },
            ].map((wish, i) => (
              <div key={i} className="card w-72 border-2 border-slate-200 dark:border-slate-700 shadow-lg p-6">
                <h4 className="text-primary font-semibold mb-2">{wish.title}</h4>
                <div className="mt-3 bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div
                    style={{ width: `${wish.progress}%` }}
                    className="bg-primary h-3 rounded-full transition-all"
                  ></div>
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  ${wish.raised} raised of ${wish.goal} goal
                </p>
                <Link
                  href="/explore"
                  className="mt-4 inline-block w-full py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition font-semibold"
                >
                  View Wishes
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-slate-800 dark:text-slate-100">
          How It Works
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { step: 1, title: "Post a Wish", desc: "Quickly submit your wish in under a minute." },
            { step: 2, title: "Get Verified", desc: "We verify each request for trust and safety." },
            { step: 3, title: "Receive Donations", desc: "Donors contribute securely to your cause." },
            { step: 4, title: "Celebrate Fulfillment", desc: "See your wish come true!" },
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md hover:-translate-y-1 transition">
              <div className="text-4xl font-bold text-primary mb-4">{item.step}</div>
              <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{item.title}</h4>
              <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-slate-50 dark:bg-slate-900 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-slate-800 dark:text-slate-100">
            What Donors & Receivers Say
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { name: "Jane Doe", msg: "This platform helped me fund my studies!" },
              { name: "Mark Smith", msg: "Donating is so easy and secure here." },
              { name: "Emily R.", msg: "I love the transparency and trust on this site." },
            ].map((t, i) => (
              <div key={i} className="card w-72 p-6 shadow-md border-2 border-slate-200 dark:border-slate-700">
                <p className="text-slate-600 dark:text-slate-300 mb-4">{t.msg}</p>
                <p className="font-semibold text-slate-800 dark:text-slate-100">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-slate-800 dark:text-slate-100">
          Platform Milestones
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { number: "120+", label: "Wishes Fulfilled" },
            { number: "350+", label: "Active Donors" },
            { number: "$45k+", label: "Amount Raised" },
          ].map((s, i) => (
            <div key={i} className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md">
              <h3 className="text-4xl font-bold text-primary mb-2">{s.number}</h3>
              <p className="text-slate-600 dark:text-slate-300">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
