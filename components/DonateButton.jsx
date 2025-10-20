import { useState } from "react";

export default function DonateButton({ wishId }) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState(""); // 'card', 'bank', 'crypto'
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleDonate() {
    if (!donorName.trim()) return alert("Please enter your name");
    if (!donorEmail.trim() || !donorEmail.includes("@")) return alert("Please enter a valid email");
    if (!amount || parseFloat(amount) <= 0) return alert("Please enter a valid amount");
    if (!method) return alert("Please select a payment method");

    setLoading(true);
    try {
      const res = await fetch("https://<your-project-ref>.functions.supabase.co/init-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wishId,
          donor_name: donorName,
          donor_email: donorEmail,
          amount: parseFloat(amount),
          method,
        }),
      });

      const data = await res.json();

      if (res.ok && data.redirect) {
        // Redirect to payment page
        window.location.href = data.redirect;
      } else {
        console.error("Donation error:", data);
        alert(data.error || "Failed to initialize payment");
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Network error, please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="donate-box bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-3 text-center">Support this Wish 💖</h3>

      <input
        type="text"
        placeholder="Your Name"
        value={donorName}
        onChange={(e) => setDonorName(e.target.value)}
        className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded-md mb-2 text-black"
      />

      <input
        type="email"
        placeholder="Your Email"
        value={donorEmail}
        onChange={(e) => setDonorEmail(e.target.value)}
        className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded-md mb-2 text-black"
      />

      <input
        type="number"
        placeholder="Enter amount (USD)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded-md mb-2 text-black"
        min="1"
      />

      <select
        value={method}
        onChange={(e) => setMethod(e.target.value)}
        className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded-md mb-3 text-black"
      >
        <option value="">Select Payment Method</option>
        <option value="card">Debit / Credit Card (Paystack)</option>
        <option value="bank">Bank Transfer (Flutterwave)</option>
        <option value="crypto">Crypto (NowPayments)</option>
      </select>

      <button
        onClick={handleDonate}
        disabled={loading}
        className={`w-full py-2 rounded-md font-semibold text-white ${
          loading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Processing..." : "Donate Now"}
      </button>
    </div>
  );
}