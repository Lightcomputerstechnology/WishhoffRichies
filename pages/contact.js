"use client";
import { useState } from "react";
import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabaseClient";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback("");

    try {
      const { error } = await supabase.from("contacts").insert([form]);
      if (error) throw error;
      setFeedback("✅ Your message has been sent! We'll get back to you soon.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error(err);
      setFeedback("❌ Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Contact Us | WishhoffRichies</title>
        <meta name="description" content="Contact WishhoffRichies for support or inquiries." />
      </Head>

      <Navbar />

      <main className="min-h-screen container mx-auto px-6 py-20 flex flex-col gap-10">
        {/* Header */}
        <section className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-primary mb-4">Contact Us 💌</h1>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Have questions, suggestions, or need help? Send us a message and we'll get back to you promptly.
          </p>
        </section>

        {/* Form */}
        <section className="max-w-3xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 bg-slate-50 dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700"
          >
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary outline-none transition bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary outline-none transition bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={form.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary outline-none transition bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              rows={6}
              required
              className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary outline-none transition bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>

            {feedback && (
              <p
                className={`text-center mt-2 font-medium ${
                  feedback.startsWith("✅") ? "text-green-500" : "text-red-500"
                }`}
              >
                {feedback}
              </p>
            )}
          </form>
        </section>
      </main>

      <Footer />
    </>
  );
}