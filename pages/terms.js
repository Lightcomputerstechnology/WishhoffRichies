import { useState } from "react";
import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const sections = [
  {
    title: "Introduction",
    content:
      "Welcome to WishhoffRichies. By using our platform, you agree to comply with these Terms of Service and our Privacy Policy."
  },
  {
    title: "Account Responsibilities",
    content:
      "Users are responsible for maintaining the confidentiality of their account information and ensuring all actions under their account comply with the law."
  },
  {
    title: "Wishes & Donations",
    content:
      "All wishes submitted must be genuine. Donations are final and cannot be refunded. We reserve the right to remove any wish that violates our guidelines."
  },
  {
    title: "Prohibited Activities",
    content:
      "Users must not use the platform for fraudulent activities, harassment, or any illegal actions. Violations may result in account termination."
  },
  {
    title: "Limitation of Liability",
    content:
      "WishhoffRichies is not liable for any damages or losses arising from the use of the platform, including failed donations or disputes between users."
  },
  {
    title: "Changes to Terms",
    content:
      "We may update these Terms of Service at any time. Users are encouraged to review the terms periodically."
  }
];

export default function Terms() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => setOpenIndex(openIndex === index ? null : index);

  return (
    <>
      <Head>
        <title>Terms of Service | WishhoffRichies</title>
        <meta name="description" content="Terms of Service for WishhoffRichies users." />
      </Head>

      <Navbar />

      <main className="min-h-screen container mx-auto px-6 py-16 flex flex-col gap-8">
        <h1 className="text-4xl font-extrabold text-center text-primary mb-8">Terms of Service</h1>

        <div className="flex flex-col gap-4 max-w-3xl mx-auto">
          {sections.map((section, idx) => (
            <div
              key={idx}
              className="border border-slate-300 dark:border-slate-700 rounded-lg p-4 transition hover:shadow-md"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full text-left font-semibold text-lg text-primary flex justify-between items-center"
              >
                {section.title}
                <span>{openIndex === idx ? "−" : "+"}</span>
              </button>
              {openIndex === idx && (
                <p className="mt-2 text-slate-600 dark:text-slate-300">{section.content}</p>
              )}
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}
