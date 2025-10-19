// components/MilestonesSection.js
import { useEffect, useState } from "react";
import ScrollWrapper from "./ScrollWrapper";

const milestonesData = [
  { label: "Wishes Granted", value: 1240 },
  { label: "Active Donors", value: 532 },
  { label: "Verified Requests", value: 860 },
  { label: "Countries Reached", value: 12 },
];

function useCountUp(target, duration = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 30);
    const interval = setInterval(() => {
      start += increment;
      if (start >= target) {
        start = target;
        clearInterval(interval);
      }
      setCount(Math.floor(start));
    }, 30);

    return () => clearInterval(interval);
  }, [target, duration]);

  return count;
}

export default function MilestonesSection() {
  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-6 grid md:grid-cols-4 gap-8 text-center">
        {milestonesData.map((milestone, i) => (
          <ScrollWrapper key={i} animation="fade-up" duration={600 + i * 200}>
            <MilestoneCard {...milestone} />
          </ScrollWrapper>
        ))}
      </div>
    </section>
  );
}

function MilestoneCard({ label, value }) {
  const count = useCountUp(value);

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
      <h3 className="text-4xl font-bold text-primary mb-2">{count}</h3>
      <p className="text-slate-700 dark:text-slate-300 font-medium">{label}</p>
    </div>
  );
}
