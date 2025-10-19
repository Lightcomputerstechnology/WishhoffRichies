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
      setFeedback("Your message has been sent! We'll get back to you soon.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error(err);
      setFeedback("Failed to send message. Please try again later.");
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

      <main className="min-h-screen container mx-auto px-6 py-16 flex flex-col gap-8">
        <h1 className="text-4xl font-extrabold text-center text-primary mb-8">Contact Us</h1>
        <p className="text-center text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-6">
          Have questions or suggestions? Send us a message and we'll get back to you as soon as possible.
        </p>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary outline-none transition"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary outline-none transition"
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={form.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary outline-none transition"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            rows={5}
            required
            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary outline-none transition"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>

          {feedback && <p className="text-center text-slate-700 dark:text-slate-200 mt-2">{feedback}</p>}
        </form>
      </main>

      <Footer />
    </>
  );
}
