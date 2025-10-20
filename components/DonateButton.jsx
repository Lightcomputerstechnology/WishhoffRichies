import { useState } from "react";

export default function DonateButton({ wishId }) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState(""); // user’s chosen payment type
  const [loading, setLoading] = useState(false);

  async function handleDonate() {
    if (!amount || parseFloat(amount) <= 0) return alert("Please enter a valid amount");
    if (!method) return alert("Please select a payment method");

    setLoading(true);
    try {
      const res = await fetch("https://<your-project-ref>.functions.supabase.co/init-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wishId,
          amount: parseFloat(amount),
          method, // e.g. 'card', 'bank', or 'crypto'
        }),
      });

      const data = await res.json();

      if (res.ok && data.url) {
        window.location.href = data.url; // redirect to payment gateway
      } else {
        console.error(data);
        alert(data.error || "Failed to initialize payment");
      }
    } catch (err) {
      console.error(err);
      alert("Network error, please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="donate-box">
      <input
        type="number"
        placeholder="Enter amount (USD)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="input"
        min="1"
      />

      <select
        value={method}
        onChange={(e) => setMethod(e.target.value)}
        className="select"
      >
        <option value="">Select Payment Method</option>
        <option value="card">Debit / Credit Card</option>
        <option value="bank">Bank / Transfer</option>
        <option value="crypto">Crypto</option>
      </select>

      <button
        onClick={handleDonate}
        disabled={loading}
        className="btn primary mt-2"
      >
        {loading ? "Processing..." : "Donate"}
      </button>
    </div>
  );
}