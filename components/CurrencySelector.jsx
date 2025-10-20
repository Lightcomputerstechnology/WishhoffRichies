// components/CurrencySelector.jsx
"use client";
export default function CurrencySelector({ value = "USD", onChange }) {
  const common = ["USD", "NGN", "EUR", "GBP", "AED", "KES"];
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="p-2 border rounded bg-transparent">
      {common.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  );
}
