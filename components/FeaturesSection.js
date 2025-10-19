// components/FeaturesSection.js
import React from "react";

const features = [
  { title: "Simple", desc: "Post a wish in under 60 seconds." },
  { title: "Trustworthy", desc: "Every request is verified before public listing." },
  { title: "Secure", desc: "Payments handled safely through Stripe & Supabase." },
  { title: "Transparent", desc: "Track donations and wish fulfillment easily." },
  { title: "Community", desc: "Connect with generous donors and volunteers." },
  { title: "Supportive", desc: "Get guidance for high-value or urgent wishes." },
];

export default function FeaturesSection() {
  return (
    <section className="container mx-auto px-6 py-16 grid md:grid-cols-3 gap-8">
      {features.map((feature, i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 transition transform hover:-translate-y-2 hover:shadow-2xl animate-fade-up"
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
