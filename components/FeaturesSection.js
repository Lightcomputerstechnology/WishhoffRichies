// components/FeaturesSection.js
import React from "react";

const features = [
  { title: "Simple", desc: "Post your wish in under 60 seconds — quick and effortless." },
  { title: "Trustworthy", desc: "Every request is verified before appearing publicly." },
  { title: "Secure", desc: "Donations handled safely via Paystack, Flutterwave, or Crypto gateways — all powered by Supabase." },
  { title: "Transparent", desc: "Track every donation and fulfillment with full visibility." },
  { title: "Community", desc: "Connect with generous donors and supporters across the world." },
  { title: "Supportive", desc: "Receive help, updates, and guidance for high-impact wishes." },
];

export default function FeaturesSection() {
  return (
    <section className="container mx-auto px-6 py-16 grid md:grid-cols-3 gap-8">
      {features.map((feature, i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 transition transform hover:-translate-y-2 hover:shadow-2xl"
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
  );
}