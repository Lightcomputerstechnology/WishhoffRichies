// components/MilestonesSection.js
import { useEffect, useState } from "react";

const milestones = [
  { label: "Wishes Fulfilled", value: 1250 },
  { label: "Donors Registered", value: 870 },
  { label: "Funds Raised ($)", value: 54000 },
  { label: "Community Volunteers", value: 320 },
];

export default function MilestonesSection() {
  const [counts, setCounts] = useState(milestones.map(() => 0));

  useEffect(() => {
    const interval = setInterval(() => {
      setCounts((prev) =>
        prev.map((c, i) => {
          if (c < milestones[i].value) {
            const increment = Math.ceil(milestones[i].value / 100);
            return Math.min(c + increment, milestones[i].value);
          }
          return c;
        })
      );
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-slate-50 dark:bg-slate-900 py-16">
      <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {milestones.map((milestone, i) => (
          <div key={i} className="animate-fade-up">
            <h3 className="text-3xl font-bold text-primary">{counts[i].toLocaleString()}</h3>
            <p className="mt-2 text-slate-700 dark:text-slate-300">{milestone.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
