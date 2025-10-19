import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const faqs = [
  {
    question: "How do I make a wish?",
    answer: "Click on 'Make a Wish' from the navbar, fill in your details, and submit your wish."
  },
  {
    question: "Is my personal information safe?",
    answer: "Yes, all data is securely stored and encrypted in our Supabase database."
  },
  {
    question: "How can I donate to a wish?",
    answer: "Browse wishes and click 'Donate'. You can choose your preferred payment method."
  },
  {
    question: "Can I cancel a donation?",
    answer: "Once a donation is processed, it cannot be cancelled. Please double-check before confirming."
  },
  {
    question: "How long does it take for a wish to be fulfilled?",
    answer: "The time depends on the donors and the wish amount. Some wishes may be fulfilled instantly, while others may take longer."
  }
];

export default function FAQ() {
  return (
    <>
      <Head>
        <title>FAQ | WishhoffRichies</title>
        <meta name="description" content="Frequently asked questions about WishhoffRichies." />
      </Head>

      <Navbar />

      <main className="min-h-screen container mx-auto px-6 py-16 flex flex-col gap-8">
        <h1 className="text-4xl font-extrabold text-center text-primary mb-8">Frequently Asked Questions</h1>

        <div className="flex flex-col gap-4 max-w-3xl mx-auto">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-slate-300 dark:border-slate-700 rounded-lg p-4 hover:shadow-md transition">
              <h2 className="font-semibold text-lg text-primary">{faq.question}</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">{faq.answer}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}
