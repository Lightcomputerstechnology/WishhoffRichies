import { useState } from "react";
import { toast } from "react-hot-toast";

export default function MakeAWish() {
  const [form, setForm] = useState({
    user_id: "",
    title: "",
    description: "",
    category: "",
    target_amount: "",
    image_url: "",
    payment_method: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/wishes/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to create wish");

      toast.success("Wish created successfully!");
      setForm({
        user_id: "",
        title: "",
        description: "",
        category: "",
        target_amount: "",
        image_url: "",
        payment_method: "",
      });
    } catch (err) {
      toast.error(err.message);
      console.error("Create wish error:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-gray-900 text-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">✨ Make a Wish</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Wish title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
        />
        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
        />
        <input
          name="target_amount"
          placeholder="Target amount"
          value={form.target_amount}
          onChange={handleChange}
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
        />
        <input
          name="payment_method"
          placeholder="Payment method"
          value={form.payment_method}
          onChange={handleChange}
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold"
        >
          Submit Wish
        </button>
      </form>
    </div>
  );
}