// components/DonateButton.jsx
import { useState } from "react";

export default function DonateButton({ wishId }) {
  const [amount, setAmount] = useState("");

  async function handleDonate() {
    if (!amount || parseFloat(amount) <= 0) return alert("Enter an amount");

    const res = await fetch("/api/checkout/create-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wishId, amount, currency: "USD" })
    });

    const json = await res.json();
    if (json.url) {
      window.location = json.url;
    } else {
      console.error(json);
      alert("Failed to create checkout session");
    }
  }

  return (
    <div>
      <input type="number" placeholder="Amount USD" value={amount} onChange={e=>setAmount(e.target.value)} />
      <button onClick={handleDonate}>Donate</button>
    </div>
  );
}
