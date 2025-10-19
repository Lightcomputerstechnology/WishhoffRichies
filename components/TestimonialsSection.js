// components/TestimonialsSection.js
import ScrollWrapper from "./ScrollWrapper";

const testimonials = [
  {
    name: "Ada Chukwu",
    text: "Thanks to WishhoffRichies, I could pay my school fees this year!",
  },
  {
    name: "Emeka Okoro",
    text: "I finally got the medical help I needed, all verified and transparent.",
  },
  {
    name: "Chinwe Nwosu",
    text: "Such a human-first platform. Donating has never been easier.",
  },
  {
    name: "Ngozi Amadi",
    text: "I love seeing the impact of my contributions on real lives.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 bg-slate-100 dark:bg-slate-800">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12">
          What People Are Saying
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((t, i) => (
            <ScrollWrapper key={i} animation="fade-up" duration={600 + i * 200}>
              <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg rounded-xl">
                <p className="text-slate-700 dark:text-slate-300 mb-4">"{t.text}"</p>
                <h4 className="text-primary font-semibold">{t.name}</h4>
              </div>
            </ScrollWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
