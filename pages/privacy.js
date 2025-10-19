import { useState } from "react";
import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const sections = [
  {
    title: "Information Collection",
    content:
      "We collect personal information such as your name, email, and wish details when you create an account or submit a wish."
  },
  {
    title: "Use of Information",
    content:
      "Collected information is used to process wishes, facilitate donations, and improve our platform experience."
  },
  {
    title: "Information Sharing",
    content:
      "We do not sell personal information. Data may be shared with payment providers or legal authorities as required."
  },
  {
    title: "Cookies & Tracking",
    content:
      "We use cookies to enhance your experience and track analytics to improve the platform. You can manage cookies in your browser settings."
  },
  {
    title: "Data Security",
    content:
      "We employ security measures to protect user data from unauthorized access, alteration, or disclosure."
  },
  {
    title: "User Rights",
    content:
      "Users may request access, correction, or deletion of their personal information by contacting our support."
  },
  {
    title: "Changes to Policy",
    content:
      "We may update this Privacy Policy from time to time. Users are encouraged to review it periodically."
  }
];

export default function Privacy() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => setOpenIndex(openIndex === index ? null : index);

  return (
    <>
      <Head>
        <title>Privacy Policy | WishhoffRichies</title>
        <meta name="description" content="Privacy Policy for WishhoffRichies users." />
      </Head>

      <Navbar />

      <main className="min-h-screen container mx-auto px-6 py-16 flex flex-col gap-8">
        <h1 className="text-4xl font-extrabold text-center text-primary mb-8">Privacy Policy</h1>

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
