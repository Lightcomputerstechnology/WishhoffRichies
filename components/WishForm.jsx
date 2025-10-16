// components/WishForm.jsx
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function WishForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title || !description || !amount) return alert("Fill required fields");

    // Simple public insert: marks wish as 'pending' for admin review
    const { data, error } = await supabase.from("wishes").insert([{
      title,
      description,
      amount_target: parseFloat(amount),
      currency: "USD",
      status: "pending"
    }]).select().single();

    if (error) {
      console.error(error);
      alert("Error creating wish");
    } else {
      alert("Wish submitted — pending admin approval.");
      setTitle(""); setDescription(""); setAmount("");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required/>
      <br />
      <textarea placeholder="Describe the wish" value={description} onChange={e=>setDescription(e.target.value)} required/>
      <br />
      <input type="number" placeholder="Amount (USD)" value={amount} onChange={e=>setAmount(e.target.value)} required/>
      <br />
      <button type="submit">Submit Wish</button>
    </form>
  );
}
