// components/TestimonialsSection.js
import { useState, useEffect } from "react";

const testimonials = [
  {
    name: "Ada Eze",
    text: "I posted a wish for my school fees, and thanks to the generous donors, it was fully funded!",
    role: "Student",
  },
  {
    name: "Chike Obi",
    text: "Donating through WishhoffRichies feels secure and transparent. I love seeing wishes fulfilled!",
    role: "Donor",
  },
  {
    name: "Nkechi Okafor",
    text: "The platform is easy to use, and I feel part of a wonderful community helping others.",
    role: "Volunteer",
  },
  {
    name: "Emeka Uzo",
    text: "The verification process is strict, so I know my donations reach the right people.",
    role: "Donor",
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000); // change testimonial every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-slate-50 dark:bg-slate-900 py-16">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-12">
          What People Say
        </h2>
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 transition">
            <p className="text-slate-600 dark:text-slate-300 text-lg mb-4">
              "{testimonials[current].text}"
            </p>
            <h4 className="text-primary font-semibold">{testimonials[current].name}</h4>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{testimonials[current].role}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
