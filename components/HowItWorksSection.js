// components/HowItWorksSection.js
const steps = [
  {
    title: "Post Your Wish",
    desc: "Create a wish with all details and submit for moderation.",
  },
  {
    title: "Get Verified",
    desc: "Our team checks and verifies every wish for authenticity.",
  },
  {
    title: "Connect with Donors",
    desc: "Generous donors browse and contribute to wishes.",
  },
  {
    title: "Track & Fulfill",
    desc: "Follow donations and see your wish fulfilled in real-time.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="container mx-auto px-6 py-16">
      <h2 className="text-4xl font-bold text-center text-slate-800 dark:text-slate-100 mb-12">
        How It Works
      </h2>
      <div className="grid md:grid-cols-4 gap-8">
        {steps.map((step, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 transition transform hover:-translate-y-2 animate-fade-up"
          >
            <h3 className="text-xl font-semibold text-primary mb-3">{step.title}</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
